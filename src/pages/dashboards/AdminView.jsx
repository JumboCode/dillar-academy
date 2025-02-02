import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react'
import { getUsers } from '../../api/user-wrapper'

const AdminView = () => {
  const { user, } = useContext(UserContext);
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

    const fetchData = async () => {
      const userData = await getUsers();
      setUsers(userData.data);
    }
    fetchData();
  }, [isLoaded, isSignedIn, user]);

  if (!allowRender) {
    return <div></div>
  }

  if (user?.privilege !== "admin") {
    return <div>Unauthorized</div>
  }

  return (
    <div className="h-full">
      <h1 class="text-xl py-4 px-2">Admin</h1>
      <table class="table-auto w-full text-left">
        <thead class="bg-neutral-200 text-lg">
          <tr>
            <th class="px-3">Name</th>
            <th class="px-3">Email</th>
            <th class="px-3">Password</th>
            <th class="px-3">Privilege</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr class="border-b">
              <td class="py-2 px-3">{user.firstName} {user.lastName}</td>
              <td class="py-2 px-3">{user.email}</td>
              <td class="py-2 px-3">{user.password}</td>
              <td class="py-2 px-3">{user.privilege}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminView;
