import axios from 'axios';
import { toTitleCase } from '@/utils/formatters';

const getConversations = async () => {
  try {
    const response = await axios.get("/api/conversations/");
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error)
    throw error;
  }
}

const getConversationById = async (conversationId) => {
  try {
    const response = await axios.get(`/api/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching conversation from id:", error);
    throw error;
  }
}

const createConversation = async (conversationData) => {
  conversationData.instructor = toTitleCase(conversationData.instructor);
  try {
    const response = await axios.post('/api/conversations', conversationData);
    return response.data;
  } catch (error) {
    console.error('Error updating conversation:', error);
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

export {
  getConversations,
  getConversationById,
  createConversation,
  updateConversation,
  deleteConversation
}