import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react'
import { getUser } from '@/api/user-wrapper';
import { getClasses } from '@/api/class-wrapper'
import { getClassById, getStudentsClasses } from '@/api/class-wrapper';
import { Link } from "wouter"
import { FaRegEdit } from "react-icons/fa";
import Button from '@/components/Button/Button';
import Class from "@/components/Class/Class";

const TeacherView = () => {
    const [ classes, setClasses ] = useState([])
    const { user, setUser } = useContext(UserContext);
    const [, setLocation] = useLocation();
    const { isSignedIn, isLoaded } = useAuth();
    const [allowRender, setAllowRender] = useState(false);
  
    useEffect(() => {
        if (isLoaded) {
            if (!isSignedIn) {
                setLocation("/login");
            } else {
                setAllowRender(true);
            }

            const classFilter = new URLSearchParams(`instructor=${user.firstName}`);

            const fetchData = async () => {
              const classData = await getClasses(classFilter);
              setClasses(classData);
            };
            fetchData();
            fetchUser();
        }
    }, [isLoaded, isSignedIn, user]);

    const fetchUser = async () => {
        if (!user || !user._id) {
            console.error("User data is missing or not yet loaded.");
            return;
        }
    
        try {
            const userFilter = new URLSearchParams({ _id: user._id });
            const response = await getUser(userFilter);
    
            if (!response || !response.data) {
                console.error("Invalid response from getUser:", response);
                return;
            }
    
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };
    

    const toTitleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);

    if (!allowRender) {
        return;
    }

    if (user?.privilege !== "teacher") {
        return <div>Unauthorized</div>
    }

    return (
        <div className="page-format">
            <br></br>
                <h3 className='font-extrabold mb-2'>
                    {`${toTitleCase(user.firstName)} ${toTitleCase(user.lastName)}`}
                </h3>
                <button className="flex"
                    onClick={() => setLocation(`/teacher/edit/${encodeURIComponent(user._id)}`)}>
                    <FaRegEdit className="mr-1 fill-neutral-400 mt-1" />
                    <p className="text-neutral-400">Edit Profile</p>
                </button>

                <p className="mt-5">
                    <span className="text-black">Email</span>{" "}
                    <span className="text-neutral-500 ml-2">{user.email}</span>
                </p>
                <section>
        <h1 className='text-3xl mb-4'> Your courses </h1>
        <div className='grid grid-cols-3 gap-6'>
        {Array.isArray(classes) && classes.length > 0 ? (
    classes.map((classObj, classIndex) => (
      <Class key={classIndex} classObj={classObj} modes={["edit"]} editURL="teacher/class"/>
    ))
  ) : (
    <p>No classes available</p>
  )}
          <div className="flex items-center">
          </div>
        </div>
      </section>
          
                <h4 className='font-extrabold mb-4 mt-8'>
                    Class Schedule
                </h4>
                <section>
        <br></br>
        <div className="table w-full table-fixed">
          <div className="table-header-group">
            <div className="table-row">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                <div key={day} className="table-cell text-center font-semibold p-2">
                  {day}
                </div>
              ))}
            </div>
          </div>
          <div className="table-row-group">
            <div className="table-row h-24">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                <div key={day} className="table-cell p-2">
                  {classes
                    .flatMap(classObj => classObj.schedule.map(schedule => ({ ...schedule, instructor: classObj.instructor })))
                    .filter(schedule => schedule.day.slice(0, 3).toUpperCase() === day)
                    .sort((a, b) => new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`)) // Sort by time
                    .map((schedule, index) => (
                      <div key={index} className="bg-blue-200 rounded p-2 mb-2">
                        <div className="text-gray-600 text-sm">{schedule.day} {schedule.time}</div>
                        <div>Class with {schedule.instructor}</div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
        </div>
    );
};

export default TeacherView;
