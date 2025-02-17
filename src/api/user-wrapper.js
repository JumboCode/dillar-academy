import axios from 'axios';
import { useSignIn } from '@clerk/clerk-react';

const postUser = async (body) => {
  try {
    const response = await axios.post("/api/sign-up", body)
    return response
  } catch (error) {
    throw error
  }
}

const postLogin = async (body) => {
  try {
    const response = await axios.post('/api/login', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response
  } catch (error) {
    console.error('Login endpoint post error:', error);
  }
}

const getUsers = async () => {
  try {
    const response = await axios.get('/api/users');
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const getUser = async (query = "") => {
  try {
    const response = await axios.get(`/api/user?${query}`);
    return response;
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

// Updated for Clerk Connection
const resetPassword = async (body) => {
  try {
    // Update password in MongoDB
    const mongoResponse = await axios.post("/api/users/reset-password", {
      headers: { 
        "Content-Type": "application/json",
       },
    });

    if (!mongoResponse || mongoResponse.status !== 200) {
      throw new Error("Failed to update password in MongoDB.");
    }

    // Update password in Clerk
    const signIn = useSignIn();
    if (!signIn) {
      throw new Error("Clerk sign-in instance not found.");
    }

    await signIn.updatePassword({ password: body.password  });

    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    return { success: false, error: error.message };
  }
}

export {
  postUser,
  postLogin,
  getUsers,
  getUser,
  getUserPassword,
  resetPassword
}