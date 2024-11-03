import axios from 'axios';

const apiUrl = (endpoint) => `${import.meta.env.VITE_API_URL}${endpoint}`

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

export {
  postUser,
  postLogin
}