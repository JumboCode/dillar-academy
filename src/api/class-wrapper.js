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

// classData should be an object containing title, level, ageGroup, instructor, and schedule
const createOrUpdateClass = async (classData) => {
  try {
    const response = await axios.post(apiUrl('/api/classes'), classData);
    return response.data;
  } catch (error) {
    console.error('Error creating/updating class:', error);
    throw error;
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

const getStudentsClasses = async (studentId) => {
  try {
    const response = await axios.get(`/api/students-classes/${studentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student's classes:", error);
  }
}

const getClassById = async (classId) => {
  try {
    const response = await axios.get(`/api/class/${classId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching class from id:", error);
  }
}

export {
  getClasses,
  getLevels,
  createOrUpdateClass,
  getConversations,
  enrollInClass,
  unenrollInClass,
  getStudentsClasses,
  getClassById,
}