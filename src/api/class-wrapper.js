import axios from 'axios'

const apiUrl = (endpoint) => `${import.meta.env.VITE_API_URL}${endpoint}`

// query should be a string
const getClasses = async (query) => {
  try {
    const response = await axios.get(apiUrl(`/api/classes?${query}`))
    return response.data
  } catch (error) {
    console.error('Error fetching courses:', error)
  }
}

// query should be a string
const getLevels = async (query) => {
  try {
    const response = await axios.get(apiUrl(`/api/levels?${query}`));
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

export {
  getClasses,
  getLevels,
  createOrUpdateClass
}