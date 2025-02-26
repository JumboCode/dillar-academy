import axios from 'axios';

// Helper to build full API URLs using your VITE_API_URL environment variable
const apiUrl = (path) => `${import.meta.env.VITE_API_URL}${path}`;

const postUser = async (body) => {
  try {
    const response = await axios.post("/api/sign-up", body);
    return response;
  } catch (error) {
    throw error;
  }
};

const postLogin = async (body) => {
  try {
    const response = await axios.post('/api/login', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error('Login endpoint post error:', error);
  }
};

const getUsers = async () => {
  try {
    const response = await axios.get('/api/users');
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const getUser = async (query = "") => {
  try {
    const response = await axios.get(`/api/user?${query}`);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Added 12/7: Get user password endpoint (if needed)
const getUserPassword = async () => {
  try {
    const response = await fetch('/api/users/password');
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error('Error fetching user password:', error);
  }
};

// Updated resetPassword function:
// - Uses the apiUrl helper
// - Parses and returns the JSON response (so your client can check response.success)
const resetPassword = async (body) => {
  try {
    const response = await fetch(apiUrl("/api/users/reset-password"), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Reset password endpoint error:', error);
  }
};

const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`/api/user/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export {
  postUser,
  postLogin,
  getUsers,
  getUser,
  getUserPassword,
  resetPassword,
  updateUser
};
