import React, { useEffect, useState } from 'react';

const StudentPortal = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchData = async() => {
      const response = await fetch('http://localhost:4000/api/users-classes?_id=671edb6d31e448b23d0dc384');
      const jsonData = await response.json(); // Converting data to json

      

      const classDetails = await Promise.all(
        jsonData.enrolledClasses.map(async (classID) => {
          console.log("class ID: ", classID);
          let url = 'http://localhost:4000/api/classes-ID?_id=' + classID;
          console.log("url: " + url);
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
      <h1>{JSON.stringify(classes)}</h1>
    </div>
  );

}

export default StudentPortal;