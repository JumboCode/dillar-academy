import React, { useEffect, useState } from 'react';
import Class from '../components/Class';

const StudentPortal = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchData = async() => {
      // fetch a specific user
      const response = await fetch('http://localhost:4000/api/users-classes?_id=671edb6d31e448b23d0dc384');
      const jsonData = await response.json(); 

      const classDetails = await Promise.all(
        jsonData.enrolledClasses.map(async (classID) => {
          let url = 'http://localhost:4000/api/classes-ID?_id=' + classID;
          const classResponse = await fetch(url);
          return classResponse.json(); // Return the class details
        })
      );

      setClasses(classDetails);
    };

    fetchData();
  }, []);

  return(
    <div>
      {classes.map((classObj, classIndex) => (
        <Class key={classIndex} classObj={classObj} />
      ))}
    </div>
  );

}

export default StudentPortal;