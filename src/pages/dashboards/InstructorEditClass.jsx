import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getClassById } from "@/api/class-wrapper";
import FormInput from '@/components/Form/FormInput'
import Button from '@/components/Button/Button';
import { updateClass } from '@/api/class-wrapper.js';
import BackButton from "@/components/Button/BackButton";
import ClassStudents from "@/components/ClassStudents";

const InstructorEditClass = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);

  const params = useParams();
  const [classObj, setClassObj] = useState(null);
  const [classData, setClassData] = useState({
    classroomLink: ''
  });

  useEffect(() => {
    if (!params.id) {
      setLocation(`/instructor`);
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
      const data = await getClassById(params.id);
      setClassObj(data);
      setClassData({ classroomLink: data.classroomLink })
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
      await updateClass(params.id, classData);
      await fetchClass();
      setLocation("/instructor")
    } catch (error) {
      console.error('Error updating class:', error);
    }
  }

  if (!allowRender || !classObj) {
    return <div></div>;
  }

  if (user.privilege !== "instructor") {
    return <div>Unauthorized</div>;
  }

  return (

    <div className="page-format space-y-10">

      <div className="flex">
        <BackButton label={"Dashboard"} href={"/instructor"} />
      </div>
      <h3 className="font-extrabold">Edit Class</h3>
      <h5 className="font-light">Edit class and student information</h5>

      <form onSubmit={handleEditClass}>
        <div className="flex justify-start space-x-10 w-2/3 mb-6">
          <div className="w-2/3 space-y-3">
            <label className="mx-1">Google Classroom Link</label>
            <FormInput
              type="text"
              name="classroomLink"
              placeholder="Google Classroom Link"
              value={classData.classroomLink}
              onChange={handleInputChange}
              isRequired={true}
            />
          </div>
        </div>

        <h4>List of Students</h4>
        <ClassStudents classID={params.id} />

        <div className="space-x-2 mt-8">
          <Button label="Save" type="submit" />
          <Button
            label="Cancel"
            isOutline={true}
            onClick={() => setLocation("/instructor")} />
        </div>
      </form>


    </div>
  )
}

export default InstructorEditClass;