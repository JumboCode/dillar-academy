import axios from 'axios';

const apiUrl = (endpoint) => `${endpoint}`

const postUser = async (body) => {
  try {
    const response = await axios.post(apiUrl("/api/users"), body)
    return response
  } catch (error) {
    throw error
  }
}

const postLogin = async (body) => {
  try {
    const response = await fetch(apiUrl("/api/login"), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    return response
  } catch (error) {
    console.error('Login endpoint post error:', error);
  }
}

const getUsers = async () => {
  try {
    const response = await fetch('/api/users')
    const jsonData = await response.json() // Converting data to json
    return jsonData
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

//added 12/7
const getUserPassword = async () => {
  try {
    const response = await fetch('/api/users/password')
    const jsonData = await response.json()
    return jsonData
  } catch (error) {
    console.error('Error fetching user password:', error);
  }
}

const resetPassword = async (body) => {
  try {
    const response = await fetch(apiUrl("/api/users/reset-password"), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    return response
  } catch (error) {
    console.error('Reset password endpoint post error:', error);
  }
}

export {
  postUser,
  postLogin,
  getUsers,
  getUserPassword,
  resetPassword
}