import axios from 'axios';
import { toTitleCase } from '@/utils/formatters';

const postUser = async (body) => {
  body.firstName = toTitleCase(body.firstName);
  body.lastName = toTitleCase(body.lastName);
  try {
    const response = await axios.post("/api/sign-up", body);
    return response;
  } catch (error) {
    throw error;
  }
};

const getUsers = async () => {
  try {
    const response = await axios.get('/api/users');
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// get user by id or email or whatsapp
const getUser = async (query = "") => {
  try {
    const response = await axios.get(`/api/user?${query}`);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const getStudentsClasses = async (studentId) => {
  try {
    const response = await axios.get(`/api/students-classes/${studentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student's classes:", error);
    throw error;
  }
}

const resetPassword = async (body) => {
  try {
    const response = await fetch("/api/users/reset-password", {
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
    throw error;
  }
};

const updateUser = async (userId, userData) => {
  try {
    if (Object.hasOwn(userData, "firstName")) {
      userData.firstName = toTitleCase(userData.firstName);
    }
    if (Object.hasOwn(userData, "lastName")) {
      userData.lastName = toTitleCase(userData.lastName);
    }
    if (Object.hasOwn(userData, "gender")) {
      userData.gender = userData.gender.toLowerCase();
    }
    const response = await axios.put(`/api/user/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

const getStudentsForExport = async () => {
  try {
    const response = await axios.get('/api/students-export');
    return response.data;
  } catch (error) {
    console.error('Error fetching students for export:', error);
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`/api/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}


export {
  postUser,
  getUsers,
  getUser,
  getStudentsClasses,
  resetPassword,
  updateUser,
  getStudentsForExport,
  deleteUser
};
