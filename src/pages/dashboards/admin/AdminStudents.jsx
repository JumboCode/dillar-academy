import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getUsers, getStudentsForExport } from '@/api/user-wrapper.js';
import Dropdown from '@/components/Dropdown/Dropdown';
import { IoSearch, IoPersonOutline } from "react-icons/io5";
import { getClasses, getStudentsClasses, getClassById } from '@/api/class-wrapper';
import UserItem from '@/components/UserItem';
import ExcelExport from 'export-xlsx';
import { SETTINGS_FOR_EXPORT } from '@/assets/excel_export_settings';

const AdminStudents = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [levels, setLevels] = useState([]);
  const [currFilter, setCurrFilter] = useState(null);
  const [searchInput, setSearchInput] = useState('');

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
      setExporting(true);
      const data = await getStudentsForExport();
      const excelExport = new ExcelExport();
      excelExport.downloadExcel(SETTINGS_FOR_EXPORT, [data]);
    } catch (error) {
      console.error('Error exporting students:', error);
    } finally {
      setExporting(false);
    }
  };

  if (!allowRender) {
    return <div></div>;
  }

  if (user?.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

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

  return (
    <div className="page-format max-w-[96rem] space-y-9">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-extrabold mb-2">Students</h1>
          <p>List of all students enrolled in Dillar Classes</p>
        </div>
        <button
          onClick={handleExportStudents}
          disabled={exporting}
          className="bg-dark-blue-800 hover:bg-white hover:border hover:border-dark-blue-800 hover:text-black text-white px-4 py-2 rounded"
        >
          {exporting ? 'Exporting...' : 'Export to Excel'}
        </button>
      </div>
      <div className="w-full inline-flex gap-x-4">
        <div className="w-full inline-flex gap-x-3 items-center py-3 px-4 rounded-sm border border-gray-300">
          <IoSearch size={16.81} className="text-gray-400" />
          <input
            type="text"
            className="w-full border-none outline-none text-[18px]"
            placeholder="Search for student by name"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Dropdown
          label={
            <div className="flex items-center justify-center gap-x-1">
              <span className="whitespace-nowrap">{currFilter ? `Level ${currFilter}` : "All Levels"}</span>
            </div>
          }
          buttonClassName="text-black min-w-fit border border-gray-300 px-5 py-3 gap-1 rounded-sm bg-white"
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
        <p>{filteredUsers.length} student(s)</p>
      </div>
      <div className="grid md:grid-cols-3 gap-x-14">
        {filteredUsers.map((userData) => (
          <UserItem userData={userData} classes={classes} key={userData._id} />

        ))}
      </div>
    </div>
  )
}

export default AdminStudents;