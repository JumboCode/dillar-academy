import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getClassById } from "@/api/class-wrapper";
import FormInput from '@/components/Form/FormInput'
import Button from '@/components/Button/Button';
import { updateClass, deleteClass } from '@/api/class-wrapper.js';

const EditClass = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);

  const params = useParams();
  const [classObj, setClassObj] = useState(null);
  const [classData, setClassData] = useState({
    level: '',
    ageGroup: '',
    instructor: '',
  });

  useEffect(() => {
    if (!params.classId) {
      setLocation(`/admin/levels/`);
    }
    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        fetchClass();
        setAllowRender(true);
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const fetchClass = async () => {
    try {
      const data = await getClassById(params.classId);
      setClassObj(data);
      setClassData({ level: data.level, ageGroup: data.ageGroup, instructor: data.instructor })
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleInputChange = (e) => {
    setClassData({
      ...classData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClass = async (e) => {
    e.preventDefault();
    try {
      await updateClass(params.classId, classData);
      await fetchClass();
      setLocation("/admin/levels")
    } catch (error) {
      console.error('Error updating class:', error);
    }
  }

  const handleDeleteClass = async () => {
    try {
      await deleteClass(params.classId);
      setLocation("/admin/levels")
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  }

  if (!allowRender || !classObj) {
    return <div></div>;
  }

  if (user.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="page-format space-y-10">
      <div className="flex">
        <button
          onClick={() => setLocation("/admin/levels")}>
          <IoChevronBack className="mr-4" />
        </button>

        <h6 className="font-light">All Classes</h6>
      </div>
      <h3 className="font-extrabold">Edit Class</h3>
      <h5 className="font-light">Edit class and student information</h5>

      <form onSubmit={handleEditClass}>
        <div className="flex justify-start space-x-10 w-2/3 mb-6">
          <div className="w-2/3 space-y-3">
            <label className="mx-1">Age Group</label>
            <FormInput
              type="text"
              name="ageGroup"
              placeholder="Age Group"
              value={classData.ageGroup}
              onChange={handleInputChange}
              isRequired={true}
            />
          </div>
          <div className="w-2/3 space-y-3">
            <label className="mx-1">Instructor</label>
            <FormInput
              type="text"
              name="instructor"
              placeholder="Instructor"
              value={classData.instructor}
              onChange={handleInputChange}
              isRequired={true}
            />
          </div>
        </div>

        <div className="flex justify-start space-x-10 w-2/3">
          <div className="w-2/3 space-y-3">
            <label className="mx-1">Date</label>
            <FormInput
              type="date"
              name="date"
              placeholder="Select Dates"
              // value={classData.ageGroup}
              onChange={handleInputChange}
              isRequired={false}
            />
          </div>
          <div className="w-2/3">
            <label className="mx-1">Time</label>
            <div className="flex space-x-4 mt-3 items-center">
              <FormInput
                type="text"
                name="startTime"
                placeholder="Start"
                // value={classData.instructor}
                // onChange={handleInputChange}
                isRequired={false}
              />
              <p className="text-3xl">-</p>
              <FormInput
                type="text"
                name="endTime"
                placeholder="End"
                // value={classData.instructor}
                // onChange={handleInputChange}
                isRequired={false}
              />
            </div>
          </div>
        </div>

        <div className="space-x-2 mt-8">
          <Button label="Save" type="submit" />
          <Button
            label="Cancel"
            isOutline={true}
            onClick={() => setLocation("/admin/levels")} />
        </div>
      </form>

      <Button label="Delete class" onClick={handleDeleteclass} />

    </div>
  )
}

export default EditClass;