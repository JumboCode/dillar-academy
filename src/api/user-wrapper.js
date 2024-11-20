import axios from 'axios';

const postUser = async (body) => {
  try {
    const response = await axios.post("/api/users", body)
    return response
  } catch (error) {
    throw error
  }
}

const postLogin = async (body) => {
  try {
    const response = await fetch("/api/login", {
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
    const response = await fetch('http://localhost:4000/api/users')
    const jsonData = await response.json() // Converting data to json
    return jsonData
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export {
  postUser,
  postLogin,
  getUsers,
}