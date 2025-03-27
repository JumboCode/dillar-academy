import { useContext, useEffect, useState } from 'react';
import { getClassById, getStudentsClasses } from '@/api/class-wrapper';
import { updateUser, getUser } from '@/api/user-wrapper';
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react'
import Class from '@/components/Class/Class'
import { Link } from "wouter"
import Button from '@/components/Button/Button';
import Form from '@/components/Form/Form';
import FormInput from '@/components/Form/FormInput';

const StudentPortal = () => {
  const [classes, setClasses] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isLoaded, isSignedIn } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    gender: '',
  });

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      }
    }

    // get student's classes
    const fetchData = async () => {
      if (user) {
        const response = await getStudentsClasses(user?._id);
        const classes = await Promise.all(
          response.enrolledClasses.map(async (classID) => {
            const classResponse = await getClassById(classID);
            return classResponse; // Return the class details
          })
        );
        setClasses(classes);
        setAllowRender(true);
      }
    };

    fetchData();
  }, [isLoaded, isSignedIn, user]);

  const fetchUser = async () => {
    const userFilter = new URLSearchParams(`_id=${user._id}`);
    const response = await getUser(userFilter);
    setUser(response.data);
  }

  const handleEditInfo = async (e) => {
    e.preventDefault();
    try {
      await updateUser(user._id, formData);
      await fetchUser();
      setShowEditModal(false);
      setFormData({ firstName: '', lastName: '', email: '', age: '', gender: '' });
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const openEditStudent = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      age: user.age || '',
      gender: user.gender || '',
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const toTitleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  if (!allowRender) {
    return;
  }

  if (user.privilege !== "student") {
    return <div>Unauthorized</div>
  }

  return (
    <div className='page-format max-w-[96rem]'>
      <br></br>
      <h1 className='font-extrabold mb-4'>
        Welcome {`${toTitleCase(user.firstName)} ${toTitleCase(user.lastName)}`}!
      </h1>
      <section>
        <table className="table-auto w-full text-left">
          <thead className="bg-neutral-200 text-lg">
            <tr>
              <th className="px-3">Name</th>
              <th className="px-3">Email</th>
              <th className="px-3">Age</th>
              <th className="px-3">Gender</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-3">{user.firstName} {user.lastName}</td>
              <td className="py-2 px-3">{user.email}</td>
              <td className="py-2 px-3">{user.age}</td>
              <td className="py-2 px-3">{user.gender}</td>
              <td className="py-2 px-3">
                <Button
                  label="Edit"
                  isOutline={true}
                  onClick={() => openEditStudent()}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section>
        <h1 className='text-3xl mb-4'> Your courses </h1>
        <div className='grid grid-cols-3 gap-6'>
          {classes.map((classObj, classIndex) => (
            <Class key={classIndex} classObj={classObj} modes={["unenroll"]} />
          ))}
          <div className="flex items-center">
            <Link
              to="/levels"
              className="ml-4 w-12 h-12 bg-blue-500 text-white text-3xl 
            font-bold rounded-full shadow-md flex items-center justify-center
            hover:bg-blue-600 transition"
            >
              +
            </Link>
          </div>
        </div>
      </section>

      <section>
        <br></br>
        <h1 className='text-3xl mb-4'>Schedule</h1>
        <div className="table w-full table-fixed">
          <div className="table-header-group">
            <div className="table-row">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                <div key={day} className="table-cell text-center font-semibold p-2">
                  {day}
                </div>
              ))}
            </div>
          </div>
          <div className="table-row-group">
            <div className="table-row h-24">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                <div key={day} className="table-cell p-2">
                  {classes
                    .flatMap(classObj => classObj.schedule.map(schedule => ({ ...schedule, instructor: classObj.instructor })))
                    .filter(schedule => schedule.day.slice(0, 3).toUpperCase() === day)
                    .sort((a, b) => new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`)) // Sort by time
                    .map((schedule, index) => (
                      <div key={index} className="bg-blue-200 rounded p-2 mb-2">
                        <div className="text-gray-600 text-sm">{schedule.day} {schedule.time}</div>
                        <div>Class with {schedule.instructor}</div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Form width="w-1/2">
            <h2 className="text-2xl font-bold mb-6">Edit User Info</h2>
            <form onSubmit={handleEditInfo} className="space-y-3">
              <FormInput
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                isRequired={true}
              />
              <FormInput
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                isRequired={true}
              />
              <FormInput
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                isRequired={true}
              />
              <FormInput
                type="text"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleInputChange}
                isRequired={false}
              />
              <FormInput
                type="text"
                name="gender"
                placeholder="Gender"
                value={formData.gender}
                onChange={handleInputChange}
                isRequired={false}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  label="Cancel"
                  isOutline={true}
                  onClick={() => {
                    setShowEditModal(false);
                    setFormData({ firstName: '', lastName: '', email: '' });
                  }}
                />
                <Button label="Save Info" type="submit" />
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}

export default StudentPortal;