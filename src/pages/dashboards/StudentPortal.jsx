import { useContext, useEffect, useState } from 'react';
import { getClassById, getStudentsClasses } from '@/api/class-wrapper';
import { updateUser } from '@/api/user-wrapper';
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react'
import { Link } from "wouter"
import Class from '@/components/Class/Class'
import Button from '@/components/Button/Button';
import FormInput from '@/components/Form/FormInput';
import Overlay from '@/components/Overlay';
import Schedule from '@/components/Schedule';
import { IoAdd, IoCreateOutline } from "react-icons/io5";


const StudentPortal = () => {
  const [classes, setClasses] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isLoaded, isSignedIn } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    gender: '',
  });

  useEffect(() => {
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

    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        fetchData();
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const toTitleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(user._id, editFormData);
      setUser(prev => ({
        ...prev,
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
        age: editFormData.age,
        gender: editFormData.gender
      }))
      setShowEditModal(false);
      setEditFormData({ firstName: '', lastName: '', email: '', age: '', gender: '' });
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const openEditUser = () => {
    setEditFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      age: user.age || '',
      gender: user.gender ? toTitleCase(user.gender) : '',
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevEditFormData) => ({
      ...prevEditFormData,
      [name]: value,
    }));
  };

  if (!allowRender) {
    return;
  }

  if (user.privilege !== "student") {
    return <div>Unauthorized</div>
  }

  return (
    <div className='page-format max-w-[96rem] lg:py-24'>
      <div>
        <span className='flex items-baseline gap-x-5 mb-1'>
          <h1 className='font-extrabold'>
            Welcome {`${toTitleCase(user.firstName)} ${toTitleCase(user.lastName)}`}!
          </h1>
          <p className='text-blue-500'>{toTitleCase(user.privilege)}</p>
        </span>
        <button onClick={openEditUser}
          className="text-gray-500 text-sm sm:text-base flex gap-x-2 items-center mb-4"
        >
          <IoCreateOutline className="font-extrabold" />
          <span>Edit Profile</span>
        </button>
        <div className="grid grid-cols-[min-content_auto] w-fit gap-x-4 gap-y-1">
          <p className='text-black col-start-1'>Email</p>
          <p className='text-gray-500 col-start-2'>{user.email}</p>
          <p className='text-black col-start-1'>WhatsApp</p>
          <p className='text-gray-500 col-start-2'>{user.email}</p>
          <p className='text-black col-start-1'>Age</p>
          <p className='text-gray-500 col-start-2'>{user.age ? user.age : "N/A"}</p>
          <p className='text-black col-start-1'>Gender</p>
          <p className='text-gray-500 col-start-2'>{user.gender ? toTitleCase(user.gender) : "N/A"}</p>
        </div>
      </div>

      <section className='my-12'>
        <h2 className='font-extrabold mb-6'> Your courses </h2>
        <div className='grid grid-cols-3 gap-6'>
          {classes.map((classObj, classIndex) => (
            <Class key={classIndex} classObj={classObj} modes={["unenroll"]} />
          ))}
          <div className="flex items-center">
            <Button
              label={<IoAdd className="text-2xl font-extrabold" />}
              isRound
              onClick={() => setLocation("/levels")}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className='font-extrabold my-8'>
          Class Schedule
        </h2>
        <Schedule classes={classes} />
      </section>

      {showEditModal && (
        <Overlay width={'w-1/2'}>
          <form onSubmit={handleEditUser} className="flex flex-col gap-y-6 py-3 px-2">
            <div className="sm:flex gap-y-6 sm:gap-y-0 sm:gap-x-6">
              <div className="w-full">
                <label>First Name</label>
                <FormInput
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={editFormData.firstName}
                  onChange={handleInputChange}
                  isRequired={true}
                />
              </div>
              <div className="w-full">
                <label>Last Name</label>
                <FormInput
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={editFormData.lastName}
                  onChange={handleInputChange}
                  isRequired={true}
                />
              </div>
            </div>
            <div className="w-full">
              <label>Email</label>
              <FormInput
                type="email"
                name="email"
                placeholder="Email"
                value={editFormData.email}
                onChange={handleInputChange}
                isRequired={true}
              />
            </div>
            <div className='w-full'>
              <label>Age</label>
              <FormInput
                type="text"
                name="age"
                placeholder="Age"
                value={editFormData.age}
                onChange={handleInputChange}
                isRequired={false}
              />
            </div>
            <div className="w-full">
              <label>Gender</label>
              <FormInput
                type="text"
                name="gender"
                placeholder="Gender"
                value={editFormData.gender}
                onChange={handleInputChange}
                isRequired={false}
              />
            </div>
            <div className="flex space-x-2">
              <Button
                label="Cancel"
                isOutline={true}
                onClick={() => {
                  setShowEditModal(false);
                  setEditFormData({ firstName: '', lastName: '', email: '', age: '', gender: '' });
                }}
              />
              <Button label="Save Info" type="submit" />
            </div>
          </form>
        </Overlay>
      )}
    </div>
  );
}

export default StudentPortal;