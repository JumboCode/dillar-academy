import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getUsers } from '@/api/user-wrapper.js';
import Dropdown from '@/components/Dropdown/Dropdown';
import { IoSearch, IoPersonOutline } from "react-icons/io5";
import { getClasses } from '@/api/class-wrapper';
import UserItem from '@/components/UserItem';

const AdminStudents = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        fetchUsers();
      }
    }

  }, [isLoaded, isSignedIn, user]);

  const fetchUsers = async () => {
    const userData = await getUsers();
    setUsers(userData.data.filter((user) => user.privilege === "student"));
    const classData = await getClasses();
    setClasses(classData);
    setAllowRender(true);
  }

  if (!allowRender) {
    return <div></div>;
  }

  if (user.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="page-format max-w-[96rem] space-y-9">
      <div>
        <h3 className="font-extrabold mb-2">Students</h3>
        <p>List of all students enrolled in Dillar Classes</p>
      </div>
      <div className="w-full inline-flex gap-x-4">
        <div className="w-full inline-flex items-center py-3 px-4 rounded-sm border border-gray-300">
          <IoSearch size={16.81} className="text-gray-400" />
          <input type="text" className="w-full border-none outline-none text-[18px]" placeholder="Search names, levels, or classes..."></input>
        </div>
        <Dropdown
          label={
            <div className="flex items-center justify-center gap-x-1">
              <span className="whitespace-nowrap">Filter By</span>
            </div>
          }
          buttonClassName="text-black min-w-fit border border-gray-300 px-5 py-3 gap-1 rounded-sm bg-white"
        ></Dropdown>
      </div>
      <div>
        <div className="text-indigo-900 inline-flex gap-x-2 items-center mb-6">
          <IoPersonOutline />
          <p>{users.length} students</p>
        </div>
        <div className="grid md:grid-cols-3 gap-x-14">
          {users.map((userData, userIndex) => (
            <Link key={userIndex} href={`/admin/user/${encodeURIComponent(userData._id)}`}><UserItem userData={userData} classes={classes} /></Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminStudents;