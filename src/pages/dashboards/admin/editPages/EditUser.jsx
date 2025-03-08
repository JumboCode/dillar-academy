import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { updateUser, getUser } from '@/api/user-wrapper.js'
import FormInput from '@/components/Form/FormInput'
import Button from '@/components/Button/Button';

const EditUser = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);

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

  if (!allowRender) {
    return <div></div>;
  }

  if (user.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="page-format">
      <h3 className="font-extrabold mb-10">Edit User</h3>
      <form onSubmit={handleEditUser} className="space-y-3">
        <FormInput
          type="text"
          name="firstName"
          placeholder="First Name"
          value={userFormData.firstName}
          onChange={handleUserInputChange}
          isRequired={true}
        />
        <FormInput
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={userFormData.lastName}
          onChange={handleUserInputChange}
          isRequired={true}
        />
        <FormInput
          type="email"
          name="email"
          placeholder="Email"
          value={userFormData.email}
          onChange={handleUserInputChange}
          isRequired={true}
        />
        <div className="flex justify-end space-x-2">
          <Button label="Save" type="submit" />
        </div>
      </form>
    </div>
  )
}

export default EditUser;