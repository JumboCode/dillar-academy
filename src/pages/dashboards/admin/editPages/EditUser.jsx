import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { updateUser, getUser } from '@/api/user-wrapper.js';
import { getClassById } from '@/api/class-wrapper';
import FormInput from '@/components/Form/FormInput'
import Button from '@/components/Button/Button';
import BackButton from "@/components/Button/BackButton";
import Class from '@/components/Class/Class';

const EditUser = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [userData, setUserData] = useState(null);
  const params = useParams();
  const [userFormData, setUserFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        setAllowRender(true);
      }
    }

    fetchUser();
  }, [isLoaded, isSignedIn, user]);

  const fetchUser = async () => {
    try {
      const userFilter = new URLSearchParams(`_id=${params.id}`);
      const userData = await getUser(userFilter);
      setUserFormData({
        firstName: userData.data.firstName,
        lastName: userData.data.lastName,
        email: userData.data.email,
        password: userData.data.password
      });
      const classes = await Promise.all(
        userData.data.enrolledClasses.map(async (classID) => {
          const classResponse = await getClassById(classID);
          return classResponse; // Return the class details
        })
      );
      userData.data.enrolledClasses = classes;
      setUserData(userData.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  const handleUserInputChange = (e) => {
    setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(params.id, userFormData);
      setUserFormData({ firstName: '', lastName: '', email: '', password: '' })
      await fetchUser();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!allowRender || !userData) {
    return <div></div>;
  }

  if (user.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="page-format space-y-12">
      {/* <BackButton label={"Class"} href={"/admin/levels/conversations/"} /> */}
      <h3 className="font-extrabold">{userData.firstName + " " + userData.lastName}</h3>
      <form onSubmit={handleEditUser} className="space-y-12">
        <div className="flex w-full gap-x-6">
          <div className="w-full">
            <label>First Name</label>
            <FormInput
              type="text"
              name="firstName"
              placeholder="First Name"
              value={userFormData.firstName}
              onChange={handleUserInputChange}
              isRequired={true}
            />
          </div>
          <div className="w-full">
            <label>Last Name</label>
            <FormInput
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={userFormData.lastName}
              onChange={handleUserInputChange}
              isRequired={true}
            />
          </div>
          <div className="w-full">
            <label>Email</label>
            <FormInput
              type="email"
              name="email"
              placeholder="Email"
              value={userFormData.email}
              onChange={handleUserInputChange}
              isRequired={true}
            />
          </div>
        </div>
      </form>
      <Button label="Save" type="submit" />
      <div>
        <h4 className="font-extrabold mb-6">{userData.firstName}'s Classes</h4>
        <div className="grid grid-cols-3 gap-6">
          {userData.enrolledClasses.map((classObj) => (
            <Class key={classObj._id} classObj={classObj} modes={["edit"]} editURL="" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default EditUser;