import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getUsers } from '@/api/user-wrapper.js'
import { IoPersonOutline } from "react-icons/io5";
import { getClasses } from '@/api/class-wrapper';
import UserItem from '@/components/UserItem'
import SearchBar from '@/components/SearchBar';
import SkeletonUser from '@/components/Skeletons/SkeletonUser';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useDelayedSkeleton from '@/hooks/useDelayedSkeleton';
import Unauthorized from "@/pages/Unauthorized";

const AdminInstructors = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const showSkeleton = useDelayedSkeleton(!allowRender);

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
    setUsers(userData.data.filter((user) => user.privilege === "instructor"));
    const classData = await getClasses();
    setClasses(classData);
    setAllowRender(true);
  }

  const filteredUsers = users.filter((user) => {
    const search = searchInput.toLowerCase();

    // Combines first + last name both ways
    const fullName1 = `${user.firstName}${user.lastName}`.toLowerCase();
    const fullName2 = `${user.lastName}${user.firstName}`.toLowerCase();

    // Flattens all class data into searchable strings
    const matchesName =
      fullName1.includes(search) || fullName2.includes(search);

    return matchesName;
  });

  if (user && user.privilege !== "admin") {
    return <Unauthorized />;
  }

  return (
    <div className="page-format max-w-[96rem] space-y-10">
      <div>
        <h1 className="font-extrabold mb-2">Instructors</h1>
        <p>List of all instructors teaching Dillar Classes</p>
      </div>
      <SearchBar input={searchInput} setInput={setSearchInput} placeholder={"Search for instructor by name"} />
      <div className="text-indigo-900 inline-flex items-center gap-x-2">
        <IoPersonOutline />
        <p className="flex">{allowRender ? `${filteredUsers.length} instructor(s)` : showSkeleton && <Skeleton width={"6rem"} />}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-x-14">
        {allowRender
          ? filteredUsers.map((userData, userIndex) => (
            <Link key={userIndex} href={`/admin/user/${encodeURIComponent(userData._id)}`}><UserItem userData={userData} classes={classes} /></Link>
          ))
          : showSkeleton && <SkeletonUser count={9} />}
      </div>
    </div>
  )
}

export default AdminInstructors;