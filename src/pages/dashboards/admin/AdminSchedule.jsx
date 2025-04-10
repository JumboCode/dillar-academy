import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import Dropdown from '../../../components/Dropdown/Dropdown';
import Schedule from '@/components/Schedule';
import { getClasses } from '@/api/class-wrapper';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react';

const AdminSchedule = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [classes, setClasses] = useState([]);
  const [currFilters, setCurrFilters] = useState([]);
  const [allowRender, setAllowRender] = useState(false);

  const level = [1, 2, 3, 4, 5];

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        const fetchData = async () => {
          const response = await getClasses();
          setClasses(response);
          setAllowRender(true);
        };
        fetchData();
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const handleAddFilter = (level) => {
    setCurrFilters(prevFilters =>
      prevFilters.includes(level)
        ? prevFilters.filter(filter => filter !== level)
        : [...currFilters, level])
  }

  if (!allowRender) {
    return <div></div>;
  }

  if (user.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="page-format max-w-[96rem] space-y-10">
      <h1 className="font-extrabold">Schedule</h1>
      <div className="w-fit">
        <Dropdown
          label={
            <div className="flex items-center justify-center gap-x-1">
              <span className="whitespace-nowrap">Filter By</span>
            </div>
          }
          buttonClassName="w-fit text-black border border-gray-300 px-5 py-3 gap-1 rounded-sm bg-white"
        >
          {level.map((level, index) => (
            <button
              key={index}
              className={`text-left px-4 py-2 text-black ${currFilters.includes(level) ? 'text-blue-500 bg-gray-50' : 'text-gray-700'}
              hover:bg-gray-50`}
              onClick={() => handleAddFilter(level)}
            >
              Level {level}
            </button>
          ))}
        </Dropdown>
      </div>
      <Schedule classes={classes} filters={currFilters} />
    </div>
  )
}

export default AdminSchedule;