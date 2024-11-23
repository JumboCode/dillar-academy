import Button from '@/components/Button'
import React from 'react'
const apiUrl = (endpoint) => `${import.meta.env.VITE_API_URL}${endpoint}`


const EnrollButton = ({ userId, classId }) => {
    const handleEnroll = async () => {
        const body = { classId };
        try {
          const response = await fetch(apiUrl("/api/users/:id/enroll"), {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
          })
          alert("Enrolled in class!")
          return response
        } catch (error) {
          console.error('Enroll endpoint put error:', error);
        }

    } 
    return (
        <Button label={"Enroll"} isOutline={false} onClick={handleEnroll}></Button>
    )
}

export default EnrollButton;