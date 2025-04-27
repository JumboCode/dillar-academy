import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams, Link } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import FormInput from '@/components/Form/FormInput'
import Button from '@/components/Button/Button';
import DeleteButton from "@/components/Button/DeleteButton";
import BackButton from "@/components/Button/BackButton";
import DayDropdown from '@/components/Dropdown/DayDropdown';
import UserItem from "@/components/UserItem";
import Alert from '@/components/Alert';
import { IoAdd, IoTrashBinOutline, IoPersonOutline } from "react-icons/io5";
import { updateClass, deleteClass, getClasses } from '@/api/class-wrapper';
import { getUser } from '@/api/user-wrapper';
import Unauthorized from "@/pages/Unauthorized";
import SkeletonUser from "@/components/Skeletons/SkeletonUser";
import useDelayedSkeleton from '@/hooks/useDelayedSkeleton';

const EditClass = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [alertMessage, setAlertMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const params = useParams();
  const [classes, setClasses] = useState(null);
  const [classObj, setClassObj] = useState(null);
  const [classData, setClassData] = useState({
    level: '',
    ageGroup: '',
    instructor: '',
    schedule: [
      {
        day: '',
        startTime: '',
        endTime: ''
      }
    ]
  });
  const [students, setStudents] = useState([]);
  const showSkeleton = useDelayedSkeleton(!allowRender);

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
    if (user) {
      const data = await getClasses();
      setClasses(data);
      const classObj = data.find(c => c._id === params.classId);
      setClassObj(classObj);
      setClassData({
        level: classObj.level,
        ageGroup: classObj.ageGroup,
        instructor: classObj.instructor,
        schedule: classData.schedule
      });
      if (classObj.schedule.length !== 0) {
        setClassData(prev => ({
          ...prev,
          schedule: classObj.schedule
        }))
      }
      const students = await Promise.all(
        classObj.roster.map(async (studentId) => {
          const studentRes = await getUser(`_id=${studentId}`);
          return studentRes.data
        })
      );
      setStudents(students);
      setAllowRender(true);
    }
  };

  const handleInputChange = (e) => {
    setClassData({
      ...classData,
      [e.target.name]: e.target.value,
    });
  };

  // TODO: confirmation if creation successful
  const handleEditClass = async (e) => {
    e.preventDefault();
    classData.ageGroup = classData.ageGroup.toLowerCase();
    const allowedAges = ["all", "children", "adults"]
    try {
      if (!allowedAges.includes(classData.ageGroup)) {
        setAlertMessage(`Age group must be all, children, or adult`);
        setTimeout(() => {
          setAlertMessage("");
        }, 4000);
      } else {
        // Filter out any time objects that are empty (i.e., missing a day or time)
        const filteredClassData = {
          ...classData,
          schedule: classData.schedule.filter(time => time.day && time.startTime && time.endTime),
        };

        await updateClass(params.classId, filteredClassData);
        setSuccessMessage("Successfully updated class details");
        await fetchClass();
        setTimeout(() => {
          setSuccessMessage("");
        }, 4000);
      }
    } catch (error) {
      console.error('Error updating class:', error);
      setAlertMessage(`Error: ${error.response.data.message}`);
      setTimeout(() => {
        setAlertMessage("");
      }, 4000);
    }
  }

  const handleDeleteClass = async () => {
    try {
      await deleteClass(params.classId);
      history.back();
    } catch (error) {
      console.error('Error deleting class:', error);
      setAlertMessage(`Error: ${error.response.data.message}`);
      setTimeout(() => {
        setAlertMessage("")
      }, 4000);
    }
  }

  const handleReset = async () => {
    setClassData({
      level: classObj.level,
      ageGroup: classObj.ageGroup,
      instructor: classObj.instructor,
      schedule: classData.schedule
    });
    if (classObj.schedule.length !== 0) {
      setClassData(prev => ({
        ...prev,
        schedule: classObj.schedule
      }))
    }
  }

  if (user && user.privilege !== "admin") {
    return <Unauthorized />;
  }

  return (
    <>
      {alertMessage !== "" && <Alert message={alertMessage} />}
      {successMessage !== "" && <Alert message={successMessage} isSuccess />}
      <div className="page-format max-w-[96rem] space-y-10">
        <BackButton label="Back to Level" />
        <div>
          <h1 className="font-extrabold mb-2">Edit Class</h1>
          <h3 className="font-light">Edit class and student information</h3>
        </div>
        <form onSubmit={handleEditClass} className="w-full lg:w-2/3">
          <div className="grid grid-cols-3 gap-x-10 w-full mb-6">
            <div className="w-full space-y-3">
              <label className="mx-1">Level</label>
              <FormInput
                type="text"
                name="level"
                placeholder="Level"
                value={classData.level}
                onChange={handleInputChange}
                isRequired={true}
              />
            </div>
            <div className="w-full space-y-3">
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
            <div className="w-full space-y-3">
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
          <div className="w-full space-y-3 mb-6">
            <div className="flex w-full gap-x-4">
              <div className="w-full grid grid-cols-2 gap-x-10">
                <label className="mx-1">Day</label>
                <label className="mx-1">Time</label>
              </div>
              <div className="invisible h-0">
                <Button
                  label={<IoTrashBinOutline />}
                  onClick={null} />
              </div>
            </div>
            <div className="space-y-4">
              {classData.schedule.map((time, index) => {
                const handleTimeInputChange = (e) => {
                  const updatedTimeArray = [...classData.schedule];
                  updatedTimeArray[index] = {
                    ...updatedTimeArray[index],
                    [e.target.name]: e.target.value,
                  };
                  setClassData({
                    ...classData,
                    schedule: updatedTimeArray,
                  });
                };
                const handleSelectedDay = (day) => {
                  const updatedTimes = [...classData.schedule];
                  updatedTimes[index] = {
                    ...updatedTimes[index],
                    day,
                  };
                  setClassData(prev => ({
                    ...prev,
                    schedule: updatedTimes,
                  }));
                };
                return (
                  <div key={index} className="flex items-center w-full gap-x-4">
                    <div className="grid grid-cols-2 w-full gap-x-10">
                      <DayDropdown selectedDay={time.day} setSelectedDay={handleSelectedDay} />
                      <div className="w-full">
                        <div className="flex space-x-4 items-center">
                          <FormInput
                            type="text"
                            name="startTime"
                            placeholder="Start Time"
                            value={time.startTime}
                            onChange={handleTimeInputChange}
                            isRequired={false}
                          />
                          <p className="text-3xl">-</p>
                          <FormInput
                            type="text"
                            name="endTime"
                            placeholder="End Time"
                            value={time.endTime}
                            onChange={handleTimeInputChange}
                            isRequired={false}
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      label={<IoTrashBinOutline />}
                      isOutline
                      onClick={() => {
                        setClassData(prevData => ({
                          ...prevData,
                          schedule: prevData.schedule.filter((_, i) => i !== index)
                        }));
                      }} />
                  </div>
                )
              })}
            </div>
          </div>
          <Button
            type="button"
            label={<div className="flex items-center gap-x-2">Add time<IoAdd /></div>}
            isOutline
            onClick={() => {
              setClassData(prevData => ({
                ...prevData,
                schedule: [
                  ...prevData.schedule,
                  { day: '', startTime: '', endTime: '' }
                ]
              }));
            }} />
          <div className="space-x-2 mt-8">
            <Button label="Save" type="submit" />
            <Button
              label="Reset"
              isOutline={true}
              onClick={handleReset} />
          </div>
        </form>
        <div>
          <h3 className="mb-2">List of Students</h3>
          <div className="text-indigo-900 inline-flex gap-x-2 items-center mb-6">
            <IoPersonOutline />
            <p>{students.length} enrolled</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {allowRender
              ? (students.map(student => (
                <Link key={student._id} href={`/admin/user/${encodeURIComponent(student._id)}`}><UserItem userData={student} classes={classes} /></Link>
              ))
              )
              : showSkeleton && <SkeletonUser count={3} />}
          </div>
        </div>
        <DeleteButton item="class" onDelete={handleDeleteClass} />
      </div>
    </>
  )
}

export default EditClass;