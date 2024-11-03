import axios from 'axios'

const apiUrl = (endpoint) => `${import.meta.env.VITE_API_URL}${endpoint}`

const getClasses = async () => {
  try {
    const response = await axios.get(apiUrl("/api/classes"))
    return response.data
  } catch (error) {
    console.error('Error fetching courses:', error)
  }
}

export {
  getClasses
}