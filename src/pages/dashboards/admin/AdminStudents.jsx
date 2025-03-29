import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getUsers } from '@/api/user-wrapper.js'
import Button from '@/components/Button/Button';
import Dropdown from '@/components/Dropdown/Dropdown';
import { IoSearch, IoPersonOutline } from "react-icons/io5";
import { getClasses, getStudentsClasses, getClassById } from '@/api/class-wrapper';
import UserItem from '@/components/UserItem'

const AdminStudents = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [levels, setLevels] = useState([]);
  const [currFilter, setCurrFilter] = useState(null);

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
    // setUsers(userData.data.filter((user) => user.privilege === "student"));
    const students = userData.data.filter((user) => user.privilege === "student");

    let allLevels = new Set();

    const studentsWithClasses = await Promise.all(
      students.map(async (student) => {
        const classRef = await getStudentsClasses(student._id);
        const classes = await Promise.all(
          (classRef.enrolledClasses || []).map(async (classID) => {
            const classData = await getClassById(classID);
            allLevels.add(classData.level);
            return classData;
          })
        );
        // student.enrolledClasses = 
        return { ...student, enrolledClasses:classes };
      })
    );

    const uniqueLevels = Array.from(allLevels).sort((a, b) => a - b);
    // console.log("the student's unique levels: ", uniqueLevels);
    setUsers(studentsWithClasses);
    setLevels(uniqueLevels);
  }

  if (!allowRender) {
    return <div></div>;
  }

  if (user?.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  const handleOptionClick = (level) => {
    setCurrFilter(level);
  };

  return (
    <div className="h-full p-8 space-y-7">
      <h3 className="font-extrabold">Students</h3>
      <p>List of all students enrolled in Dillar Classes</p>
      <div className="w-full inline-flex">
        <div className="w-[91%] inline-flex items-center p-1 pl-2 gap-3 border border-black rounded-xs border-gray-300">
          <IoSearch size={16.81} className="text-gray-400" />
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
          >

            {levels.map((level, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-2 text-base font-normal text-black hover:bg-gray-100"
                onClick={() => handleOptionClick(level)} /* Handle click here */
              >
                Level {level}
              </button>
            ))}

          </Dropdown>
        </div>

      </div>
      <div className="text-indigo-900 inline-flex text-[18px] items-center ">
        <IoPersonOutline size={18.43} />
        <p>{users.length} students</p>
      </div>
      <div className="grid md:grid-cols-3 gap-x-14">


        {users
        .filter(user => !currFilter || user.enrolledClasses?.some(cls => cls.level === parseInt(currFilter)) )
        .map((userData, userIndex) => (
          <UserItem userData={userData} classes={classes} key={userIndex} />

        ))}
      </div>
    </div>
  )
}

export default AdminStudents;