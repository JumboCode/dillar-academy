import axios from 'axios';
import { toTitleCase } from '@/utils/formatters';

// query should be a string
const getAllClasses = async (query = "") => {
  try {
    const response = await axios.get(`/api/all-classes?${query}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw error;
  }
}

// query should be a string
const getClasses = async (query = "") => {
  try {
    const response = await axios.get(`/api/classes/classes?${query}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw error;

  }
}

const getClassById = async (classId) => {
  try {
    const response = await axios.get(`/api/classes/classes/${classId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching class from id:", error);
    throw error;
  }
}

const createClass = async (classData) => {
  classData.instructor = toTitleCase(classData.instructor);
  try {
    const response = await axios.post('/api/classes/classes', classData);
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
    const response = await axios.put(`/api/classes/classes/${classId}`, classData);
    return response.data;
  } catch (error) {
    console.error('Error updating class:', error);
    throw error;
  }
}

const deleteClass = async (classId) => {
  try {
    const response = await axios.delete(`/api/classes/classes/${classId}`);
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

export {
  getAllClasses,
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  enrollInClass,
  unenrollInClass
}