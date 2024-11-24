import axios from 'axios'

// query should be a string
const getClasses = async (query = "") => {
  try {
    const response = await axios.get(`/api/classes?${query}`)
    return response.data
  } catch (error) {
    console.error('Error fetching courses:', error)
  }
}

// query should be a string
const getLevels = async (query = "") => {
  try {
    const response = await axios.get(`/api/levels?${query}`);
    return response.data
  } catch (error) {
    console.error('Error fetching levels:', error);
  }
}

const getConversations = async () => {
  try {
    const response = await axios.get("/api/conversations/")
    return response.data
  } catch (error) {
    console.error('Error fetching conversations:', error)
  }
}

const enrollInClass = async (classId, userId) => {
  try {
    const response = await fetch(`/api/users/${userId}/enroll`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ classId })
    })
    return response
  } catch (error) {
    console.error('Enroll endpoint put error:', error);
  }
}

const unenrollInClass = async (classId, userId) => {
  try {
    const response = await fetch(`/api/users/${userId}/unenroll`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ classId })
    })
    return response
  } catch (error) {
    console.error('Enroll endpoint put error:', error);
  }
}

export {
  getClasses,
  getLevels,
  getConversations,
  enrollInClass,
  unenrollInClass
}