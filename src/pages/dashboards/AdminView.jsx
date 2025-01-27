import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import Button from '@/components/Button/Button';
import Form from '@/components/Form/Form';
import FormInput from '@/components/Form/FormInput';

const AdminView = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [classes, setClasses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    level: '',
    ageGroup: '',
    instructor: '',
  });

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        setAllowRender(true);
      }
    }
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (allowRender) {
      fetchClasses();
    }
  }, [allowRender]);

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes');
      const data = await response.json();
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
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowCreateModal(false);
        setFormData({ title: '', level: '', ageGroup: '', instructor: '' });
        await fetchClasses();
      }
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  const handleEditClass = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/classes/${selectedClass._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowEditModal(false);
        setSelectedClass(null);
        setFormData({ title: '', level: '', ageGroup: '', instructor: '' });
        await fetchClasses();
      }
    } catch (error) {
      console.error('Error updating class:', error);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchClasses();
      }
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const openEditModal = (classData) => {
    setSelectedClass(classData);
    setFormData({
      title: classData.title,
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

  return (
    <div className="h-full p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Class Management</h1>
        <Button 
          label="Create Class" 
          onClick={() => setShowCreateModal(true)} 
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age Group</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.map((classItem) => (
              <tr key={classItem._id}>
                <td className="px-6 py-4 whitespace-nowrap">{classItem.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{classItem.level}</td>
                <td className="px-6 py-4 whitespace-nowrap">{classItem.ageGroup}</td>
                <td className="px-6 py-4 whitespace-nowrap">{classItem.instructor}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <Button 
                    label="Edit" 
                    isOutline={true}
                    onClick={() => openEditModal(classItem)} 
                  />
                  <Button 
                    label="Delete" 
                    isOutline={true}
                    onClick={() => handleDeleteClass(classItem._id)} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Form width="w-1/2">
            <h2 className="text-2xl font-bold mb-6">Create New Class</h2>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <FormInput
                type="text"
                name="title"
                placeholder="Class Title"
                value={formData.title}
                onChange={handleInputChange}
                isRequired={true}
              />
              <FormInput
                type="text"
                name="level"
                placeholder="Level"
                value={formData.level}
                onChange={handleInputChange}
                isRequired={true}
              />
              <FormInput
                type="text"
                name="ageGroup"
                placeholder="Age Group"
                value={formData.ageGroup}
                onChange={handleInputChange}
                isRequired={true}
              />
              <FormInput
                type="text"
                name="instructor"
                placeholder="Instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                isRequired={true}
              />
              <div className="flex justify-end space-x-2">
                <Button 
                  label="Cancel" 
                  isOutline={true}
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ title: '', level: '', ageGroup: '', instructor: '' });
                  }} 
                />
                <Button label="Create" type="submit" />
              </div>
            </form>
          </Form>
        </div>
      )}

      {/* Edit Class Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Form width="w-1/2">
            <h2 className="text-2xl font-bold mb-6">Edit Class</h2>
            <form onSubmit={handleEditClass} className="space-y-4">
              <FormInput
                type="text"
                name="title"
                placeholder="Class Title"
                value={formData.title}
                onChange={handleInputChange}
                isRequired={true}
              />
              <FormInput
                type="text"
                name="level"
                placeholder="Level"
                value={formData.level}
                onChange={handleInputChange}
                isRequired={true}
              />
              <FormInput
                type="text"
                name="ageGroup"
                placeholder="Age Group"
                value={formData.ageGroup}
                onChange={handleInputChange}
                isRequired={true}
              />
              <FormInput
                type="text"
                name="instructor"
                placeholder="Instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                isRequired={true}
              />
              <div className="flex justify-end space-x-2">
                <Button 
                  label="Cancel" 
                  isOutline={true}
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedClass(null);
                    setFormData({ title: '', level: '', ageGroup: '', instructor: '' });
                  }} 
                />
                <Button label="Save" type="submit" />
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default AdminView;
