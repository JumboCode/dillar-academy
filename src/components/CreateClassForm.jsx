import { useState } from 'react';
import { createOrUpdateClass } from '../api/class-wrapper';

const CreateClassForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    level: '',
    ageGroup: '',
    instructor: '',
    schedule: [{ day: '', time: '' }]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createOrUpdateClass(formData);
      alert(response.message); // Show success message
      // Reset form
      setFormData({
        title: '',
        level: '',
        ageGroup: '',
        instructor: '',
        schedule: [{ day: '', time: '' }]
      });
    } catch (error) {
      alert('Error creating/updating class: ' + error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = {
      ...newSchedule[index],
      [field]: value
    };
    setFormData({
      ...formData,
      schedule: newSchedule
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-dark-blue-800 mb-4">Create/Edit Class</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Level</label>
          <input
            type="text"
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Age Group</label>
          <input
            type="text"
            name="ageGroup"
            value={formData.ageGroup}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Instructor</label>
          <input
            type="text"
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {formData.schedule.map((scheduleItem, index) => (
          <div key={index} className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Schedule {index + 1}</h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Day"
                value={scheduleItem.day}
                onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Time"
                value={scheduleItem.time}
                onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create/Update Class
        </button>
      </form>
    </div>
  );
};

export default CreateClassForm;
