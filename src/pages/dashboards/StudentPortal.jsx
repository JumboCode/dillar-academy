import { useContext, useEffect, useState} from 'react';
import { getClassById, getStudentsClasses } from '@/api/class-wrapper';
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react'
import Class from '@/components/Class'
import { Link } from "wouter"


const StudentPortal = () => {
  const [classes, setClasses] = useState([]);
  const { user, } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isLoaded, isSignedIn } = useAuth();
  const [allowRender, setAllowRender] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        setAllowRender(true);
      }
    }

    // get student's classes
    const fetchData = async () => {
      if (user) {
        const response = await getStudentsClasses(user?._id);
        const classes = await Promise.all(
          response.enrolledClasses.map(async (classID) => {
            const classResponse = await getClassById(classID);
            return classResponse; // Return the class details
          })
        );
        setClasses(classes);
        console.log(classes)
      }
    };

    fetchData();
  }, [isLoaded, isSignedIn, user]);

  if (!allowRender) {
    return;
  }

  if (user?.privilege !== "student") {
    return <div>Unauthorized</div>
  }

  return (
    <div className='h-full'>
      <br></br>
      <h1 className='text-4xl font-bold mb-4'>
        Welcome {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}!
      </h1>

      <section>
        <h1 className='text-3xl mb-4'> Your courses </h1>
        <div className='grid grid-cols-3 gap-6'>
          {classes.map((classObj, classIndex) => (
            <Class key={classIndex} classObj={classObj} />
          ))}
          <div className="flex items-center">
          <Link
            to="/levels"
            className="ml-4 w-12 h-12 bg-blue-500 text-white text-3xl 
            font-bold rounded-full shadow-md flex items-center justify-center
            hover:bg-blue-600 transition"
          >
            +
          </Link>
        </div>
        </div>
      </section>


      <section>
        <br></br>
        <h1 className='text-3xl mb-4'>Schedule</h1>
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
                  {classes.map((classObj) =>
                    classObj.schedule.map((schedule, index) =>
                      schedule.day.slice(0, 3).toUpperCase() === day  ? (
                        <div key={index} className="bg-blue-200 rounded p-2 mb-2">
                          <div>{schedule.name}</div>
                          <div className="text-gray-600 text-sm">{schedule.day} {schedule.time}</div>
                        </div>
                      ) : null
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );

}

export default StudentPortal;
