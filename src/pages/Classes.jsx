import axios from 'axios';
import { useState, useEffect } from 'react';

const Classes = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
      const fetchCourses = async () => {
        try {
          const response = await axios.get('http://localhost:4000/api/data');
          setCourses(response.data);
          console.log(response.data)
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      };
      fetchCourses();
    }, []);

    return (
      <div>
        <h1>Course List</h1>
        {courses.length === 0 ? (
          <p>Loading courses...</p>
        ) : (
          <ul>
            {courses.map(course => (
              <li key={course._id}>
                  <strong>{course.title}</strong> (Level: {course.level}, Instructor: {course.instructor})
              </li>
            ))}
          </ul>
        )}
      </div>
    );
}

export default Classes