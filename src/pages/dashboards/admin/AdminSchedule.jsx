import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import Dropdown from '../../../components/Dropdown/Dropdown';
import {getClasses} from '@/api/class-wrapper';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react';

const AdminSchedule = () => {
    const { user } = useContext(UserContext);
    const [, setLocation] = useLocation();
    const { isSignedIn, isLoaded } = useAuth();
    const [classes, setClasses] = useState([]);
    const [currFilter, setCurrFilter] = useState(null);
    const [allowRender, setAllowRender] = useState(false);

    const level = [1, 2, 3, 4, 5];

    useEffect(() => {
        if (isLoaded) {
            if (!isSignedIn) {
                setLocation("/login");
            } else {
                setAllowRender(true);
                const fetchData = async () => {
                    const response = await getClasses();
                    setClasses(response);
                };
                fetchData();
            }
        }
    }, [isLoaded, isSignedIn, user]);

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
        <div className="h-full p-8 space-y-10">
            <h3 className="font-extrabold">Schedule</h3>

            <Dropdown
                label={
                    <div className="flex items-center justify-center gap-x-1">
                        <span className="text-[18px] pt-2">Filter By</span>
                    </div>
                }
            >

                {level.map((level, index) => (
                    <button
                        key={index}
                        className="w-full text-left px-4 py-2 text-base font-normal text-black hover:bg-gray-100"
                        onClick={() => handleOptionClick(level)} /* Handle click here */
                    >
                        Level {level}
                    </button>
                ))}

            </Dropdown>
            <section>
                <br></br>
                <div className="table w-full table-fixed">
                <div className="table-header-group">
                    <div className="table-row">
                    {['SUN','MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                        <div key={day} className="table-cell text-center font-semibold p-2">
                            {day}
                        </div>
                    ))}
                    </div>
                </div>
                <div className="table-row-group">
                    <div className="table-row h-24">
                    {['SUN','MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                        <div key={day} className="table-cell p-2">
                        
                        {classes.length > 0 ? (classes
                            .flatMap(classObj => classObj.schedule.map(schedule => ({ ...schedule, instructor: classObj.instructor, level: classObj.level })))
                            .filter(schedule => schedule.day.slice(0, 3).toUpperCase() === day)
                            .filter(schedule => !currFilter || schedule.level === currFilter)
                            .sort((a, b) => new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`)) // Sort by time
                            .map((schedule, index) => (
                            <div key={index} className="bg-blue-200 rounded p-2 mb-2">
                                <div className="text-gray-600 text-sm">{schedule.day} {schedule.time}</div>
                                <div>Class with {schedule.instructor}</div>
                            </div>))) : (<div>no classes</div>)
                            }
                        </div>
                    ))}
                    </div>
                </div>
            </div>
            </section>
        </div>
    )
}

export default AdminSchedule;