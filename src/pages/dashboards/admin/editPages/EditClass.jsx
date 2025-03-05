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
      <h3 className="font-extrabold">Edit Class</h3>
      <form onSubmit={handleEditClass} className="space-y-3">
        <FormInput
          type="text"
          name="level"
          placeholder="Level"
          value={classData.level}
          onChange={handleInputChange}
          isRequired={true}
        />
        <FormInput
          type="text"
          name="ageGroup"
          placeholder="Age Group"
          value={classData.ageGroup}
          onChange={handleInputChange}
          isRequired={true}
        />
        <FormInput
          type="text"
          name="instructor"
          placeholder="Instructor"
          value={classData.instructor}
          onChange={handleInputChange}
          isRequired={true}
        />
        <div className="flex justify-end space-x-2">
          <Button label="Save" type="submit" />
        </div>
      </form>
      <Button label="Delete" onClick={handleDeleteClass} />
    </div>
  )
}

export default EditClass;