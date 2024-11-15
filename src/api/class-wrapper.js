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

export {
  getClasses,
  getLevels
}