import { useState, useEffect } from 'react';
import Class from '../components/Class';

const Classes = () => {
  const [classes, setClasses] = useState(null);

  useEffect(() => {
    const fetchClass = async () => {
      const response = await fetch('http://localhost:5173/classes')
      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }
      const data = await response.json();
      console.log(data);
      setClasses(data);
    }
    fetchClass();
  }, []);
  

  return (
    <div>
      <h1>Open Classes</h1>
      <div className='ClassList'>
      {classes.map((classItem) =>(
        <Class
          key={classItem.id || 'na'} 
          Level = {classItem.level}
          Instructor = {classItem.instructor}
          ageGroup= {classItem.ageGroup}
          schedule= {classItem.schedule}
        />
      ))}
      </div>
    </div>
  );
}

export default Classes