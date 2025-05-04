import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { IoPersonOutline } from "react-icons/io5";
import { getUsers, getStudentsForExport } from '@/wrapper/user-wrapper.js';
import { getClasses, getClassById } from '@/wrapper/class-wrapper';
import { getStudentsClasses } from '@/wrapper/user-wrapper';
import Unauthorized from "@/pages/Unauthorized";
import Dropdown from '@/components/Dropdown/Dropdown';
import Button from '@/components/Button/Button';
import SearchBar from '@/components/SearchBar';
import UserItem from '@/components/UserItem';
import SkeletonUser from '@/components/Skeletons/SkeletonUser';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useDelayedSkeleton from '@/hooks/useDelayedSkeleton';
import ExcelExport from 'export-xlsx';
import { SETTINGS_FOR_EXPORT } from '@/assets/excel_export_settings';

const AdminStudents = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [levels, setLevels] = useState([]);
  const [currFilter, setCurrFilter] = useState(null);
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
    const students = userData.data.filter((user) => user.privilege === "student");
    const classData = await getClasses();
    setClasses(classData);

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

        return { ...student, enrolledClasses: classes };
      })
    );

    const uniqueLevels = Array.from(allLevels).sort((a, b) => a - b);
    setUsers(studentsWithClasses);
    setLevels(uniqueLevels);
    setAllowRender(true);
  }

  const handleExportStudents = async () => {
    try {
      const data = await getStudentsForExport();
      const excelExport = new ExcelExport();
      excelExport.downloadExcel(SETTINGS_FOR_EXPORT, [data]);
    } catch (error) {
      console.error('Error exporting students:', error);
    }
  };

  const handleOptionClick = (level) => {
    setCurrFilter(level);
  };

  const filteredUsers = users.filter((user) => {
    const search = searchInput.toLowerCase();

    // Combines first + last name both ways
    const fullName1 = `${user.firstName}${user.lastName}`.toLowerCase();
    const fullName2 = `${user.lastName}${user.firstName}`.toLowerCase();

    // Flattens all class data into searchable strings
    const matchesName =
      fullName1.includes(search) || fullName2.includes(search);

    const matchesLevel =
      !currFilter || user.enrolledClasses?.some(cls => cls.level === parseInt(currFilter));

    const matchesClass =
      user.enrolledClasses?.some(cls =>
        cls.ageGroup?.toLowerCase().includes(search) ||
        cls.instructor?.toLowerCase().includes(search)
      );

    return (matchesName || matchesClass) && matchesLevel;
  });

  if (user && user.privilege !== "admin") {
    return <Unauthorized />;
  }

  return (
    <div className="page-format max-w-[96rem] space-y-10">
      <div className="flex flex-col items-start md:flex-row md:items-center md:justify-between">
        <div className="mb-6 md:m-0">
          <h1 className="font-extrabold mb-2">Students</h1>
          <p>List of all students enrolled in Dillar Classes</p>
        </div>
        <Button
          label={'Export Students'}
          onClick={handleExportStudents}
        />
      </div>
      <div className="w-full inline-flex gap-x-4">
        <SearchBar input={searchInput} setInput={setSearchInput} placeholder={"Search for student by name"} />
        <Dropdown
          label={
            <div className="flex items-center justify-center gap-x-1">
              <span className="whitespace-nowrap">{currFilter ? `Level ${currFilter}` : "All Levels"}</span>
            </div>
          }
          buttonClassName="text-black min-w-fit border border-gray-400 px-5 py-3 gap-1 rounded-sm bg-white"
        >
          <button
            key="all"
            className={`w-full text-left px-4 py-2 text-base font-normal text-black hover:bg-gray-100 ${currFilter === null ? 'text-blue-500 bg-gray-50' : 'text-gray-700'}`}
            onClick={() => handleOptionClick(null)}
          >
            All Levels
          </button>

          {levels.map((level) => (
            <button
              key={level}
              className={`w-full text-left px-4 py-2 text-base font-normal text-black hover:bg-gray-100 ${currFilter === level ? 'text-blue-500 bg-gray-50' : 'text-gray-700'}`}
              onClick={() => handleOptionClick(level)} /* Handle click here */
            >
              Level {level}
            </button>
          ))}
        </Dropdown>
      </div>
      <div className="text-indigo-900 inline-flex items-center gap-x-2">
        <IoPersonOutline />
        <p className="flex">{allowRender ? `${filteredUsers.length} student(s)` : showSkeleton && <Skeleton width={"6rem"} />}</p>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-14 gap-y-3">
        {allowRender
          ? filteredUsers.map((userData) => (
            <Link key={userData._id} to={`/admin/user/${encodeURIComponent(userData._id)}`}>
              <UserItem key={userData._id} privilege="admin" userData={userData} classes={classes} isShowClass />
            </Link>
          ))
          : showSkeleton && <SkeletonUser count={12} />}
      </div>
    </div>
  )
}

export default AdminStudents;