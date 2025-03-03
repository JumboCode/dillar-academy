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

const createClass = async (classData) => {
  try {
    const response = await axios.post('/api/classes', classData);
    return response.data;
  } catch (error) {
    console.error('Error creating/updating class:', error);
    throw error;
  }
}

const updateClass = async (classId, classData) => {
  try {
    const response = await axios.put(`/api/classes/${classId}`, classData);
    return response.data;
  } catch (error) {
    console.error('Error updating class:', error);
    throw error;
  }
}

const deleteClass = async (classId) => {
  try {
    const response = await axios.delete(`/api/classes/${classId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting class:', error);
    throw error;
  }
}

const enrollInClass = async (classId, userId) => {
  try {
    const response = await axios.put(`/api/users/${userId}/enroll`, { classId });
    return response.data;
  } catch (error) {
    console.error('Enroll endpoint put error:', error);
    throw error;
  }
}

const unenrollInClass = async (classId, userId) => {
  try {
    const response = await axios.put(`/api/users/${userId}/unenroll`, { classId });
    return response.data;
  } catch (error) {
    console.error('Unenroll endpoint put error:', error);
    throw error;
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

const getLevelById = async (levelId) => {
  try {
    const response = await axios.get(`/api/levels/${levelId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching level from id:", error);
  }
}

const updateLevel = async (levelId, LevelData) => {
  try {
    const response = await axios.put(`/api/levels/${levelId}`, LevelData);
    return response.data;
  } catch (error) {
    console.error('Error updating level:', error);
    throw error;
  }
}

const deleteLevel = async (levelId) => {
  try {
    const response = await axios.delete(`/api/levels/${levelId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting level:', error);
    throw error;
  }
}

//make createLevel endpoint
//3 endpoints to create: create, edit levels, delete 

export {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  getConversations,
  enrollInClass,
  unenrollInClass,
  getStudentsClasses,
  getClassById,
  getLevels,
  deleteLevel,
  updateLevel,
  getLevelById,
}