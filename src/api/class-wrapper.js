import axios from 'axios'

// query should be a string
const getClasses = async (query = "") => {
  try {
    const response = await axios.get(`/api/classes?${query}`)
    return response.data
  } catch (error) {
    console.error('Error fetching courses:', error)
  }
}

// query should be a string
const getLevels = async (query = "") => {
  try {
    const response = await axios.get(`/api/levels?${query}`);
    return response.data
  } catch (error) {
    console.error('Error fetching levels:', error);
  }
}

const getConversations = async () => {
  try {
    const response = await axios.get("/api/conversations/")
    return response.data
  } catch (error) {
    console.error('Error fetching conversations:', error)
  }
}

const createClass = async (classData) => {
  try {
    const response = await axios.post('/api/classes', classData);
    return response.data;
  } catch (error) {
    console.error('Error creating/updating class:', error);
    throw error;
  }
}

const updateClass = async (classId, classData) => {
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
  }
}

const getClassById = async (classId) => {
  try {
    const response = await axios.get(`/api/class/${classId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching class from id:", error);
  }
}

const adminEnrollStudent = async (email, classId) => {
  console.log(`📡 Sending request to enroll: Email - ${email}, Class ID - ${classId}`); // Debugging log

  try {
    const response = await axios.post("/api/enroll-student", { email, classId });

    console.log("🔄 Server response:", response); // Debugging log

    if (response.status !== 200) {
      throw new Error(response.data.message || "Error enrolling student.");
    }

    return response.data.message;
  } catch (error) {
    console.error("Error enrolling student:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Error enrolling student.");
  }
};

export {
  getClasses,
  getLevels,
  createClass,
  updateClass,
  deleteClass,
  getConversations,
  enrollInClass,
  unenrollInClass,
  getStudentsClasses,
  getClassById,
  adminEnrollStudent
}