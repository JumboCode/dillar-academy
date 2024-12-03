import { useEffect, useState } from 'react';
import Class from '@/components/Class';
import { getClassById, getStudentClasses } from '@/api/class-wrapper';

const StudentPortal = () => {
  const [classes, setClasses] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const user = {
      firstName: params.get('firstName'),
      lastName: params.get('lastName'),
      username: params.get('username')
    };
    setUser(user);

    // get classes for student
    const fetchData = async () => {
      // fetch a specific user
      const response = await getStudentClasses("674f72531d7f25e7213721cd");
      const classes = await Promise.all(
        response.enrolledClasses.map(async (classID) => {
          const classResponse = await getClassById(classID);
          return classResponse; // Return the class details
        })
      );
      setClasses(classes);
    };

    fetchData();
  }, []);

  return (
    <div className='h-full'>
      <h1>Student: {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</h1>
      <div className='grid grid-cols-3'>
        {classes.map((classObj, classIndex) => (
          <Class key={classIndex} classObj={classObj} />
        ))}
      </div>
    </div>
  );

}

export default StudentPortal;
