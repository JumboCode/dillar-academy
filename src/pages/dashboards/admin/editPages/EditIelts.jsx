import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getIeltsById } from "@/wrappers/ielts-wrapper";
import FormInput from '@/components/Form/FormInput'
import Button from '@/components/Button/Button';
import DeleteButton from "@/components/Button/DeleteButton";
import DayDropdown from '@/components/Dropdown/DayDropdown';
import BackButton from "@/components/Button/BackButton";
import Alert from '@/components/Alert';
import SupplementaryClassPreview from "@/components/Class/SupplementaryClassPreview";
import { updateIelts, deleteIelts } from '@/wrappers/ielts-wrapper.js';
import { IoAdd, IoTrashBinOutline } from "react-icons/io5";
import Unauthorized from "@/pages/Unauthorized";

const EditIelts = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [ieltsObj, setIeltsObj] = useState(null);
  const [ieltsData, setIeltsData] = useState({
    ageGroup: '',
    instructor: '',
    link: '',
    schedule: [
      {
        day: '',
        startTime: '',
        endTime: ''
      }
    ]
  });
  const params = useParams();

  useEffect(() => {
    if (!params.id) {
      setLocation(`/admin/levels/ielts`);
    }
    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        fetchIelts()
      }
    }

  }, [isLoaded, isSignedIn, user]);

  const fetchIelts = async () => {
    try {
      const data = await getIeltsById(params.id);
      setIeltsObj(data);
      setIeltsData({
        ageGroup: data.ageGroup,
        instructor: data.instructor,
        link: data.link,
        schedule: ieltsData.schedule
      });
      if (data.schedule.length !== 0) {
        setIeltsData(prev => ({
          ...prev,
          schedule: data.schedule
        }))
      }
      setAllowRender(true);
    } catch (error) {
      console.error('Error fetching IELTS class:', error);
    }
  };

  const handleInputChange = (e) => {
    setIeltsData({
      ...ieltsData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditIelts = async (e) => {
    e.preventDefault();
    ieltsData.ageGroup = ieltsData.ageGroup.toLowerCase();
    const allowedAges = ["all", "children", "adults"]
    try {
      if (!allowedAges.includes(ieltsData.ageGroup)) {
        setAlertMessage(`Age group must be all, children, or adult`);
        setTimeout(() => {
          setAlertMessage("")
        }, 4000);
      } else {
        setIsSaving(true);

        const filteredIeltsData = {
          ...ieltsData,
          schedule: ieltsData.schedule.filter(time => time.day && time.startTime && time.endTime),
        };

        if (filteredIeltsData.schedule.length === 0) {
          setAlertMessage(`Must add IELTS class time(s)`);
          setTimeout(() => {
            setAlertMessage("");
          }, 4000);
        } else {
          await updateIelts(params.id, filteredIeltsData);
          setSuccessMessage("Successfully updated IELTS class details");
          await fetchIelts();
          setTimeout(() => {
            setSuccessMessage("");
          }, 4000);
          setIsSaving(false);
        }
      }
    } catch (error) {
      setIsSaving(false);
      console.error('Error updating IELTS class:', error);
      setAlertMessage(`Error: ${error.response.data.message}`);
      setTimeout(() => {
        setAlertMessage("");
      }, 4000);
    }
  }

  const handleDeleteIelts = async () => {
    try {
      await deleteIelts(params.id);
      history.back();
    } catch (error) {
      console.error('Error deleting IELTS class:', error);
      setAlertMessage(`Error: ${error.response.data.message}`)
      setTimeout(() => {
        setAlertMessage("")
      }, 4000);
    }
  }

  const handleReset = () => {
    setIeltsData(prev => ({
      ageGroup: ieltsObj.ageGroup,
      instructor: ieltsObj.instructor,
      schedule: ieltsObj.schedule.length !== 0 ? ieltsObj.schedule : prev.schedule
    }));
  };

  if (user && user.privilege !== "admin") {
    return <Unauthorized />;
  }

  return (
    <>
      {alertMessage !== "" && <Alert message={alertMessage} />}
      {successMessage !== "" && <Alert message={successMessage} isSuccess />}
      <div className="page-format max-w-[96rem] space-y-10">
        <BackButton label="All IELTS classes" />
        <div className="space-y-2">
          <h1 className="font-extrabold">Edit IELTS Class</h1>
          <h3 className="font-light">Edit IELTS class and student information</h3>
        </div>
        <div className="w-1/3">
          <h3 className="mb-2">Conversation Class Preview</h3>
          <SupplementaryClassPreview
            cls={ieltsData}
          />
        </div>
        <form onSubmit={handleEditIelts} className="w-full lg:w-2/3">
          <div className="grid grid-cols-2 gap-x-10 w-full mb-6">
            <div className="w-full space-y-3">
              <label className="mx-1">Age Group</label>
              <FormInput
                type="text"
                name="ageGroup"
                placeholder="Age Group"
                value={ieltsData.ageGroup}
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
                value={ieltsData.instructor}
                onChange={handleInputChange}
                isRequired={true}
              />
            </div>
          </div>
          <div className="w-full mb-6">
            <label className="mx-1">Class Link</label>
            <FormInput
              type="text"
              name="link"
              placeholder="Enter class link"
              value={ieltsData.link}
              onChange={handleInputChange}
            />
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
              {ieltsData.schedule.map((time, index) => {
                const handleTimeInputChange = (e) => {
                  const updatedTimeArray = [...ieltsData.schedule];
                  updatedTimeArray[index] = {
                    ...updatedTimeArray[index],
                    [e.target.name]: e.target.value,
                  };
                  setIeltsData({
                    ...ieltsData,
                    schedule: updatedTimeArray,
                  });
                };
                const handleSelectedDay = (day) => {
                  const updatedTimes = [...ieltsData.schedule];
                  updatedTimes[index] = {
                    ...updatedTimes[index],
                    day,
                  };
                  setIeltsData(prev => ({
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
                            placeholder="Start Time (24h UTC)"
                            value={time.startTime}
                            onChange={handleTimeInputChange}
                            isRequired={false}
                          />
                          <p className="text-3xl">-</p>
                          <FormInput
                            type="text"
                            name="endTime"
                            placeholder="End Time (24h UTC)"
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
                        setIeltsData(prevData => ({
                          ...prevData,
                          schedule: prevData.schedule.filter((_, i) => i !== index)
                        }));
                      }} />
                  </div>
                )
              })}
            </div>
            <div className="w-full grid grid-cols-2">
              <p className="italic text-blue-500 col-start-2">Enter times in UTC and 24 hour format</p>
            </div>
          </div>
          <Button
            type="button"
            label={<div className="flex items-center gap-x-2">Add time<IoAdd /></div>}
            isOutline
            onClick={() => {
              setIeltsData(prevData => ({
                ...prevData,
                schedule: [
                  ...prevData.schedule,
                  { day: '', startTime: '', endTime: '' }
                ]
              }));
            }} />
          <div className="space-x-2 mt-8">
            <Button label={isSaving ? "Saving..." : "Save"} type="submit" isDisabled={isSaving} />
            <Button
              label="Reset"
              isOutline={true}
              onClick={handleReset} />
          </div>
        </form>
        <DeleteButton item="IELTS class" onDelete={handleDeleteIelts} />
      </div>
    </>
  )
}

export default EditIelts;