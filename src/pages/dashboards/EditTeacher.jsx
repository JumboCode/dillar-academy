import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { updateUser, getUser } from '@/api/user-wrapper.js';
import FormInput from '@/components/Form/FormInput'
import Button from '@/components/Button/Button';
import BackButton from "@/components/Button/BackButton";

const EditTeacher = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const params = useParams();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const userFilter = new URLSearchParams(`_id=${params.id}`);

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
      const userData = await getUser(userFilter);
      setUserData({
        firstName: userData.data.firstName,
        lastName: userData.data.lastName,
        email: userData.data.email,
        password: userData.data.password
      });
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  const handleUserInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(params.id, userData);
      await fetchUser();
      setLocation("/instructor")
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!allowRender || !userData) {
    return <div></div>;
  }

  if (user.privilege !== "teacher" || user._id !== userFilter.toString().slice(4)) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="page-format space-y-12">
      <BackButton label={"Dashboard"} href={"/instructor"} />
      <h3 className="font-extrabold">Edit Information</h3>
      <form onSubmit={handleEditUser} className="space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="w-full">
            <label>First Name</label>
            <FormInput
              type="text"
              name="firstName"
              placeholder="First Name"
              value={userData.firstName}
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
              value={userData.lastName}
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
              value={userData.email}
              onChange={handleUserInputChange}
              isRequired={true}
            />
          </div>
        </div>
        <Button label="Save" type="submit" />
      </form>
    </div>
  )
}

export default EditTeacher;