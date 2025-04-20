
import axios from 'axios';

const getTranslations = async (lng, ns) => {
  try {
    const response = await axios.get(`/api/locales/${lng}/${ns}`);
    return response;
  } catch (error) {
    console.error("Failed to fetch translations:", error);
  }
}

const editTranslation = async (lng, ns, key, newTranslation) => {
  try {
    const response = await axios.put(`/api/locales/${lng}/${ns}/${key}`, {
      newTranslation
    });
    return response;
  } catch (error) {
    console.error('Failed to edit translation:', error);
  }
}

export {
  getTranslations,
  editTranslation
}