import Button from '@/components/Button'
import React from 'react'
// import axios from 'axios'
const apiUrl = (endpoint) => `${import.meta.env.VITE_API_URL}${endpoint}`


const EnrollButton = ({ classId, userId }) => {
    const handleEnroll = async () => {
        const body = { classId, userId };
        try {
          const response = await fetch(apiUrl("/api/enroll"), {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
          })
        
      
          return response
        } catch (error) {
          console.error('Contact endpoint post error:', error);
        }
    } 
    return (
        <Button label={"Enroll"} isOutline={false} onClick={handleEnroll}></Button>
    )
}

// const EnrollButton = async (userId, classId) => {
//     const studentId = new ObjectId(userId);
//     const classObjId = new ObjectId(classId);
  
//     // Add class to user's list
//     await db.collection('users').updateOne(
//       { _id: studentId },
//       { $addToSet: { enrolledClasses: classObjId } }
//     );
//     return (
//         <Button label={"Enroll"} onClick={onClick}></Button>
//         )
//   };

//   export {EnrollButton};

export default EnrollButton;