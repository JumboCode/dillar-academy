import { useContext, useEffect, useState } from 'react';
import { getClassById, getStudentsClasses } from '@/api/class-wrapper';
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react'

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
      <h1>Student</h1>
    </div>
  );

}

export default StudentPortal;
