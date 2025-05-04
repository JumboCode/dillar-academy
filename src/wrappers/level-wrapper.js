import axios from 'axios';
import { transferTranslations } from "@/wrapper/translation-wrapper";
import { toTitleCase } from '@/utils/formatters';

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

export {
  getLevels,
  createLevel,
  updateLevel,
  deleteLevel
}