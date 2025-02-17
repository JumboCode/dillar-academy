import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import Button from '@/components/Button/Button';
import Form from '@/components/Form/Form';
import FormInput from '@/components/Form/FormInput';
import { getUsers } from '@/api/user-wrapper.js'
import { getClasses, createClass, updateClass, deleteClass } from '@/api/class-wrapper.js';

const AdminView = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        setAllowRender(true);
      }
    }

    const fetchData = async () => {
      const userData = await getUsers();
      setUsers(userData.data);
    }
    fetchData();
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (allowRender) {
      fetchClasses();
    }
  }, [allowRender]);

  const fetchClasses = async () => {
    try {
      const data = await getClasses();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await createClass(formData);
      setShowCreateModal(false);
      setFormData({ level: '', ageGroup: '', instructor: '' });
      await fetchClasses();
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  const handleEditClass = async (e) => {
    e.preventDefault();
    try {
      await updateClass(selectedClass._id, formData);
      setShowEditModal(false);
      setSelectedClass(null);
      setFormData({ level: '', ageGroup: '', instructor: '' });
      await fetchClasses();
    } catch (error) {
      console.error('Error updating class:', error);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      await deleteClass(classId);
      await fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const openEditModal = (classData) => {
    setSelectedClass(classData);
    setFormData({
      level: classData.level,
      ageGroup: classData.ageGroup,
      instructor: classData.instructor,
    });
    setShowEditModal(true);
  };

  if (!allowRender) {
    return <div></div>;
  }

  if (user?.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }


  const handleEnrollment = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // 1. Move errors to backend in EnrollUser rather than frontend (use alert instead)
      // 2. Use App.jsx for {email}
      // Fetch student's email
      const userFilter = new URLSearchParams(`email=${email}`);
      const response = await getUser(userFilter);
      const student = response.data;

      const studentId = student._id;

      // Check if the student is already enrolled in the class
      if (student.enrolledClasses.includes(classId)) {
        throw new Error("Student is already enrolled in this class");
      }

      // Enroll student in the class
      const enrollmentResponse = await enrollInClass(classId, studentId);

      if (!enrollmentResponse.ok) {
        throw new Error("Failed to enroll student");
      }

      setSuccess("Student successfully enrolled to class");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-full">
      <h1>Admin</h1>
    </div>
  );
};

export default AdminView;