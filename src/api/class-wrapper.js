import axios from 'axios';
import { transferTranslations } from "@/api/translation-wrapper";

const toTitleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// query should be a string
const getClasses = async (query = "") => {
  try {
    const response = await axios.get(`/api/classes?${query}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw error;

  }
}

const getConversations = async () => {
  try {
    const response = await axios.get("/api/conversations/");
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error)
    throw error;
  }
}

const createClass = async (classData) => {
  classData.instructor = toTitleCase(classData.instructor);
  try {
    const response = await axios.post('/api/classes', classData);
    return response.data;
  } catch (error) {
    console.error('Error creating/updating class:', error);
    throw error;
  }
}

const updateClass = async (classId, classData) => {
  if (Object.hasOwn(classData, "instructor")) {
    classData.instructor = toTitleCase(classData.instructor);
  }
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
    throw error;
  }
}

const getClassById = async (classId) => {
  try {
    const response = await axios.get(`/api/class/${classId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching class from id:", error);
    throw error;
  }
}

// query should be a string
const getLevels = async (query = "") => {
  try {
    const response = await axios.get(`/api/levels?${query}`);
    return response.data
  } catch (error) {
    console.error('Error fetching levels:', error);
    throw error;
  }
}

const getLevelById = async (levelId) => {
  try {
    const response = await axios.get(`/api/levels/${levelId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching level from id:", error);
    throw error;
  }
}

const createLevel = async (levelData) => {
  levelData.skills = levelData.skills.map(skill => skill.toLowerCase());
  try {
    const response = await axios.post(`/api/levels/`, levelData);
    await transferTranslations();
    return response.data;
  } catch (error) {
    console.error('Error creating level:', error);
    throw error;
  }
}

const updateLevel = async (levelId, levelData) => {
  try {
    const response = await axios.put(`/api/levels/${levelId}`, levelData);
    await transferTranslations();
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

const getConversationById = async (conversationId = "") => {
  try {
    const response = await axios.get(`/api/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching conversation from id:", error);
    throw error;
  }
}

const updateConversation = async (conversationId, conversationData) => {
  if (Object.hasOwn(conversationData, "instructor")) {
    conversationData.instructor = toTitleCase(conversationData.instructor);
  }
  try {
    const response = await axios.put(`/api/conversations/${conversationId}`, conversationData);
    return response.data;
  } catch (error) {
    console.error('Error updating conversation:', error);
    throw error;
  }
}

const deleteConversation = async (conversationId) => {
  try {
    const response = await axios.delete(`/api/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
}

const createConversation = async (conversationData) => {
  conversationData.instructor = toTitleCase(conversationData.instructor);
  try {
    const response = await axios.post('/api/conversations', conversationData);
    return response.data;
  } catch (error) {
    console.error('Error creating/updating conversation:', error);
    throw error;
  }
}

export {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  enrollInClass,
  unenrollInClass,
  getStudentsClasses,
  getClassById,
  getLevels,
  deleteLevel,
  updateLevel,
  createLevel,
  getLevelById,
  getConversations,
  getConversationById,
  updateConversation,
  deleteConversation,
  createConversation
}