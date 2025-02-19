import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getUsers, updateUser } from '@/api/user-wrapper.js'
import Button from '@/components/Button/Button';
import Form from '@/components/Form/Form';
import FormInput from '@/components/Form/FormInput';

const AdminStudents = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);

  const [users, setUsers] = useState([]);
  const [showUserEditModal, setShowUserEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState({
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
      } else {
        setAllowRender(true);
      }
    }

    fetchUsers();
  }, [isLoaded, isSignedIn, user]);

  const fetchUsers = async () => {
    const userData = await getUsers();
    setUsers(userData.data);
  }

  const handleUserInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };


  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(selectedUser._id, userData);
      setShowUserEditModal(false);
      setSelectedUser(null);
      setUserData({ firstName: '', lastName: '', email: '', age: '', gender: '' })
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const openUserEditModal = (userData) => {
    setSelectedUser(userData);
    setUserData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      age: userData.age || '',
      gender: userData.gender || ''
    });
    setShowUserEditModal(true);
  };

  if (!allowRender) {
    return <div></div>;
  }

  if (user?.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="h-full p-8 space-y-10">
      <h3 className="font-extrabold">Students</h3>
      <section>
        <table className="table-auto w-full text-left">
          <thead className="bg-neutral-200 text-lg">
            <tr>
              <th className="px-3">Name</th>
              <th className="px-3">Email</th>
              <th className="px-3">Password</th>
              <th className="px-3">Privilege</th>
              <th className="px-3">Age</th>
              <th className="px-3">Gender</th>
              <th className="px-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((userData, userIndex) => (
              <tr key={userIndex} className="border-b">
                <td className="py-2 px-3">{userData.firstName} {userData.lastName}</td>
                <td className="py-2 px-3">{userData.email}</td>
                <td className="py-2 px-3">{userData.password}</td>
                <td className="py-2 px-3">{userData.privilege}</td>
                <td className="py-2 px-3">{userData.age}</td>
                <td className="py-2 px-3">{userData.gender}</td>
                <td className="py-2 px-3">
                  <Button label="Edit" isOutline={true} onClick={() => openUserEditModal(userData)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {showUserEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Form width="w-1/2">
            <h2 className="text-2xl font-bold mb-6">Edit User</h2>
            <form onSubmit={handleEditUser} className="space-y-4">
              <FormInput
                type="text"
                name="firstName"
                placeholder="First Name"
                value={userData.firstName}
                onChange={handleUserInputChange}
                isRequired={true}
              />
              <FormInput
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={userData.lastName}
                onChange={handleUserInputChange}
                isRequired={true}
              />
              <FormInput
                type="email"
                name="email"
                placeholder="Email"
                value={userData.email}
                onChange={handleUserInputChange}
                isRequired={true}
              />
              <FormInput
                type="text"
                name="age"
                placeholder="Age"
                value={userData.age}
                onChange={handleUserInputChange}
                isRequired={false}
              />
              <FormInput
                type="text"
                name="gender"
                placeholder="Gender"
                value={userData.gender}
                onChange={handleUserInputChange}
                isRequired={false}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  label="Cancel"
                  isOutline={true}
                  onClick={() => {
                    setShowUserEditModal(false);
                    setSelectedUser(null);
                    setUserData({ firstName: '', lastName: '', email: '', age: '', gender: '' });
                  }}
                />
                <Button label="Save" type="submit" />
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  )
}

export default AdminStudents;