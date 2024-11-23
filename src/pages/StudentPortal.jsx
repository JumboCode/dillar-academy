import React, { useEffect, useState } from 'react';

const StudentPortal = () => {
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  // const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async() => {
      const response = await fetch('http://localhost:4000/api/users-classes?_id=671edb6d31e448b23d0dc384');
      const jsonData = await response.json(); // Converting data to json
      setUsers(jsonData);

      

      const classDetails = await Promise.all(
        jsonData.map(async (classID) => {
          // let classID = classObj._id;
          console.log("class ID: ", classID);
          // console.log("Class ID:", classID);
          // console.log("url: " + 'http://localhost:4000/api/classes-ID/' + classID);
          let url = 'http://localhost:4000/api/classes-ID?_id=' + classID;
          console.log("url: " + url);
          const classResponse = await fetch(url);
          // console.log(classID);
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
      {/* <h1>{JSON.stringify(users)}</h1> */}

    </div>
  );

}

export default StudentPortal;

// useEffect(() => {
//   const fetchData = async() => {
//     //Fetching data
//     try {
//       const response = await fetch('http://localhost:4000/api/users');
//       const jsonData = await response.json() // Converting data to json
//       // setUser(jsonData.find(item => item._id === "671edb6d31e448b23d0dc384").enrolledClasses); // Set data appropriately
//       const selectedUser = jsonData.find(item => item._id === "671edb6d31e448b23d0dc384");
//       setUser(selectedUser)
//       // const user = user.find(item => item._id === "671edb6d31e448b23d0dc384");
//       const response2 = await fetch('http://localhost:4000/api/classes');
//       const jsonData2 = await response2.json() // Converting data to json
//       setClasses(jsonData2.filter((classItem) =>
//       selectedUser.enrolledClasses.includes(classItem._id)));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }

