import Button from '@/components/Button'
import React from 'react'
const apiUrl = (endpoint) => `${import.meta.env.VITE_API_URL}${endpoint}`


const UnenrollButton = ({ userId, classId }) => {
  const handleUnenroll = async () => {
      const body = { classId };
      try {
        const response = await fetch(apiUrl("/api/users/:id/unenroll"), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body)
        })
        alert("Unenrolled in class!")
        return response
      } catch (error) {
        console.error('Unenroll endpoint put error:', error);
      }
  } 
  return (
      <Button label={"Unenroll"} isOutline={false} onClick={handleUnenroll}></Button>
  )
}

export default UnenrollButton;