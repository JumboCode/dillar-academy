import axios from 'axios';
import { useState, useEffect } from 'react';
import './container.css';

  const Classes = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/levels');
        setCourses(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

   return (
    <div className = "course-grid" style={{
        display: "flex",
        gridTemplateColumns: "repeat (4, 1fr)",
        gap: "20px",
        padding: "20px"
    }}>
        
        {/* <div className = "verticle-grid">  */}
            {courses.map((course, index) => (
                <div className = "course-card" style={{
                    backgroundColor: "#fff",
                    // #fff
                    padding: "20px",
                    borderRadius: "8px",
                    width: "25%",
                    height: "25%",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",

                }}>
                
                    {/* {image && <img src="img.png" className="course-image" />} */}
                    <h3 style={{
                        margin: "0",
                        fontSize: "1.2em",
                        fontWeight: "bold",
                        textAlign: "left"

                    }}>Level: {course.level}</h3>
                    <p style={{
                        textAlign: "left",
                        margin: "10px 0",
                        color: "#666"

                    }}>{course.name}</p>
                    <p style={{
                        textAlign: "left",
                        margin: "10px 0",
                        color: "#666"

                    }}>Description</p>
                    <div className = "instructors" style={{
                        textAlign: "left",
                        color: "#666"

                    }}>
                        <span> Instructors:</span>
                        {courses.map(course => (
                            <p key={course.id}>
                                {course.instructors && course.instructors.map((instructors, index) => (
                                    <span key = {index}>
                                        {course.instructor}{index < course.instructors.length -1 && ','}
                                    </span>
                                ))}
                            </p>
                        ))}
                        {/* {course.instructors && course.instructors.map((instructors, index) => (
                        <span key={index}>
                            {JSON.stringify(course.instructor)}{index < course.instructors.length - 1 ? ',':''}
                        </span>
                        ))} */}
                    </div>
                </div>                
            )
        )}
        {/* </div> */}
    </div>
    
  );
}

export default Classes;


// {courses.length === 0 ? (
//     <p>Loading courses...</p>
//   ) : (
//     <ul className = "m-5"> 
//     {courses.map(course => (
//         <li key={course.id}>
//             <strong>{course.name}</strong> Level: {course.level}, {course.instructors.map((instructors, index) =>
//             (<span key={index}><strong>{instructors}</strong>{index < course.instructors.length - 1 && ', '}</span>))}
//         </li>
//     ))}
//     </ul>
//   )}