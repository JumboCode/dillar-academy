import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import Button from '@/components/Button/Button';
import AdminEnrollButton from "@/components/Button/AdminEnrollButton";
import Form from '@/components/Form/Form';
import FormInput from '@/components/Form/FormInput';
import { getUsers } from '@/api/user-wrapper.js'
import { getClasses, createClass, updateClass, deleteClass, adminEnrollStudent } from '@/api/class-wrapper.js';

const AdminView = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [email, setEmail] = useState("");
  const [classId, setClassId] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
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


  return (
    <div className="h-full p-8 space-y-10">
      <h1 className="text-3xl font-bold">Admin</h1>
      <section>
        <h2 className="text-2xl font-bold mb-4">Enroll Student</h2>
        
        <Form>
          <FormInput
            type="email"
            name="email"
            placeholder="Student Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isRequired={true}
          />
          <FormInput
            type="text"
            name="classId"
            placeholder="Class ID"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            isRequired={true}
          />
          <AdminEnrollButton email={email} classId={classId} />
        </Form>
      </section>
      <section>
        <table className="table-auto w-full text-left">
          <thead className="bg-neutral-200 text-lg">
            <tr>
              <th className="px-3">Name</th>
              <th className="px-3">Email</th>
              <th className="px-3">Password</th>
              <th className="px-3">Privilege</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, userIndex) => (
              <tr key={userIndex} className="border-b">
                <td className="py-2 px-3">{user.firstName} {user.lastName}</td>
                <td className="py-2 px-3">{user.email}</td>
                <td className="py-2 px-3">{user.password}</td>
                <td className="py-2 px-3">{user.privilege}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">Class Management</h1>
          <Button
            label="Create Class"
            onClick={() => setShowCreateModal(true)}
          />
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classes.map((classItem) => (
                <tr key={classItem._id}>
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
      </section>

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Form width="w-1/2">
            <h2 className="text-2xl font-bold mb-6">Create New Class</h2>
            <form onSubmit={handleCreateClass} className="space-y-4">
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
                    setFormData({ level: '', ageGroup: '', instructor: '' });
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
                    setFormData({ level: '', ageGroup: '', instructor: '' });
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