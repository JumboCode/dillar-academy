import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getUsers } from '@/api/user-wrapper.js'
import Button from '@/components/Button/Button';
import Dropdown from '@/components/Dropdown/Dropdown';
import { IoSearch , IoPersonOutline  } from "react-icons/io5";
import { getClasses } from '@/api/class-wrapper';
import UserItem from '@/components/UserItem'
const AdminStudents = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [classes, setClasses] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
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
    setUsers(userData.data.filter((user) => user.privilege === "student"));
    const classData = await getClasses();
    setClasses(classData);
  }

  if (!allowRender) {
    return <div></div>;
  }

  if (user?.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }


  return (
    <div className="h-full p-8 space-y-7">
      <h3 className="font-extrabold">Students</h3>
      <p>List of all students enrolled in Dillar Classes</p>
      <div className="w-full inline-flex">
        <div className="w-[91%] inline-flex items-center p-1 pl-2 gap-3 border border-black rounded-xs border-gray-300">
          <IoSearch size={16.81} className="text-gray-400"/>
          <input type="text" className="w-5/6 border-none outline-none text-[18px]" placeholder="Search names, levels, or classes..."></input>
        </div>
        <div className="inline-flex">
          <Dropdown
            label={
                  <div className="flex items-center justify-center gap-x-1">
                    <span className="text-[18px] pt-2">Filter By</span>
                  </div>
            }
            buttonClassName="flex items-center justify-center w-full text-base font-normal text-black min-w-fit   sm:px-5 gap-1 rounded-lg bg-white"
          ></Dropdown>
        </div>
        
      </div>
      <div className="text-indigo-900 inline-flex text-[18px] items-center ">
          <IoPersonOutline size={18.43}/>
          <p>{users.length} students</p>
      </div> 
      <div className="">
      

      {users.map((userData, userIndex) => (

              <UserItem userData={userData} classes={classes} />
                
            ))}   
      </div>     
    </div>
  )
}

export default AdminStudents;