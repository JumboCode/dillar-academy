import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams, Link } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import FormInput from '@/components/Form/FormInput'
import Button from '@/components/Button/Button';
import BackButton from "@/components/Button/BackButton";
import DateDropdown from '@/components/Dropdown/DateDropdown';
import UserItem from "@/components/UserItem";
import { IoPersonOutline } from "react-icons/io5";
import { updateClass, deleteClass, getClasses } from '@/api/class-wrapper';
import { getUser } from '@/api/user-wrapper';

const EditClass = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);

  const params = useParams();
  const [classes, setClasses] = useState(null);
  const [classObj, setClassObj] = useState(null);
  const [classData, setClassData] = useState({
    level: '',
    ageGroup: '',
    instructor: '',
  });
  const [selectedDates, setSelectedDates] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (!params.classId) {
      setLocation(`/admin/levels/`);
    }
    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        fetchClass();
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const fetchClass = async () => {
    try {
      const data = await getClasses();
      setClasses(data);
      const classObj = data.find(c => c._id === params.classId);
      setClassObj(classObj);
      setClassData({ level: classObj.level, ageGroup: classObj.ageGroup, instructor: classObj.instructor });
      const students = await Promise.all(
        classObj.roster.map(async (studentId) => {
          const studentRes = await getUser(`_id=${studentId}`);
          return studentRes.data
        })
      );
      setStudents(students);
      setAllowRender(true);
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
    <div className="page-format max-w-[96rem] space-y-10">
      <BackButton label="Back to Level" />
      <div>
        <h3 className="font-extrabold mb-2">Edit Class</h3>
        <h5 className="font-light">Edit class and student information</h5>
      </div>

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
            <DateDropdown selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
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
      <div>
        <h5 className="mb-2">List of Students</h5>
        <div className="text-indigo-900 inline-flex gap-x-2 items-center mb-6">
          <IoPersonOutline />
          <p>{students.length} enrolled</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3">
          {students.map(student => (
            <Link key={student._id} href={`/admin/user/${encodeURIComponent(student._id)}`}><UserItem userData={student} classes={classes} /></Link>
          ))}
        </div>
      </div>
      <Button label="Delete class" onClick={handleDeleteClass} />
    </div>
  )
}

export default EditClass;