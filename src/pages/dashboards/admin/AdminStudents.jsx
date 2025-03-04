import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getUsers } from '@/api/user-wrapper.js'
import Button from '@/components/Button/Button';

const AdminStudents = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);

  const [users, setUsers] = useState([]);

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

  if (!allowRender) {
    return <div></div>;
  }

  if (user?.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="page-format space-y-10">
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
                  <Button label="Edit" isOutline={true} onClick={() => setLocation(`/admin/students/${userData._id}`)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default AdminStudents;