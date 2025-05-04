import axios from 'axios';
import { toTitleCase } from '@/utils/formatters';

const getIelts = async () => {
  try {
    const response = await axios.get('/api/ielts');
    return response.data;
  } catch (error) {
    throw error;
  }
}

const getIeltsById = async (ieltsId) => {
  try {
    const response = await axios.get(`/api/ielts/${ieltsId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching IELTS from id:", error);
    throw error;
  }
}

const createIelts = async (ielts) => {
  ielts.instructor = toTitleCase(ielts.instructor);
  try {
    const response = await axios.post('/api/ielts', ielts);
    return response.data;
  } catch (error) {
    console.error('Error creating IELTS class:', error);
    throw error;
  }
}

const updateIelts = async (ieltsId, ielts) => {
  if (Object.hasOwn(ielts, "instructor")) {
    ielts.instructor = toTitleCase(ielts.instructor);
  }
  try {
    const response = await axios.put(`/api/ielts/${ieltsId}`, ielts);
    return response.data;
  } catch (error) {
    console.error('Error updating IELTS class:', error);
    throw error;
  }
}

const deleteIelts = async (ieltsId) => {
  try {
    const response = await axios.delete(`/api/ielts/${ieltsId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting IELTS class:', error);
    throw error;
  }
}

export {
  getIelts,
  getIeltsById,
  createIelts,
  updateIelts,
  deleteIelts,
}