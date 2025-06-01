import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams, Link } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import FormInput from '@/components/Form/FormInput'
import Button from '@/components/Button/Button';
import DeleteButton from "@/components/Button/DeleteButton";
import DayDropdown from '@/components/Dropdown/DayDropdown';
import BackButton from "@/components/Button/BackButton";
import UserItem from "@/components/UserItem";
import Alert from '@/components/Alert';
import SupplementaryClassPreview from "@/components/Class/SupplementaryClassPreview";
import ImagePicker from "@/components/ImagePicker";
import { levelImgs } from "@/constants/images";
import { getClassStudents } from '@/wrappers/class-wrapper';
import { getConversationById, updateConversation, deleteConversation } from '@/wrappers/conversation-wrapper.js';
import { IoAdd, IoTrashBinOutline, IoPersonOutline } from "react-icons/io5";
import Unauthorized from "@/pages/Unauthorized";
import SkeletonUser from "@/components/Skeletons/SkeletonUser";
import useDelayedSkeleton from '@/hooks/useDelayedSkeleton';

const EditConversation = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isOpenImagePicker, setIsOpenImagePicker] = useState(false);
  const [conversationObj, setConversationObj] = useState(null);
  const [conversationData, setConversationData] = useState({
    ageGroup: '',
    instructor: '',
    link: '',
    schedule: [
      {
        day: '',
        startTime: '',
        endTime: ''
      }
    ],
    image: ''
  });
  const [students, setStudents] = useState([]);
  const params = useParams();
  const showSkeleton = useDelayedSkeleton(!allowRender);

  useEffect(() => {
    if (!params.id) {
      setLocation(`/admin/levels/conversations`);
    }
    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        fetchConversation()
      }
    }

  }, [isLoaded, isSignedIn, user]);

  const fetchConversation = async () => {
    try {
      const data = await getConversationById(params.id);
      setConversationObj(data);
      setConversationData({
        ageGroup: data.ageGroup,
        instructor: data.instructor,
        link: data.link,
        schedule: conversationData.schedule,
        image: data.image || "level_img_0.webp"
      });
      if (data.schedule.length !== 0) {
        setConversationData(prev => ({
          ...prev,
          schedule: data.schedule
        }))
      }
      const students = await getClassStudents(data._id);
      setStudents(students);
      setAllowRender(true);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const handleInputChange = (e) => {
    setConversationData({
      ...conversationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditConversation = async (e) => {
    e.preventDefault();
    conversationData.ageGroup = conversationData.ageGroup.toLowerCase();
    const allowedAges = ["all", "children", "adults"]
    try {
      if (!allowedAges.includes(conversationData.ageGroup)) {
        setAlertMessage(`Age group must be all, children, or adult`);
        setTimeout(() => {
          setAlertMessage("")
        }, 4000);
      } else {
        setIsSaving(true);

        const filteredConversationData = {
          ...conversationData,
          schedule: conversationData.schedule.filter(time => time.day && time.startTime && time.endTime),
        };

        if (filteredConversationData.schedule.length === 0) {
          setAlertMessage(`Must add conversation class time(s)`);
          setTimeout(() => {
            setAlertMessage("");
          }, 4000);
        } else {
          await updateConversation(params.id, filteredConversationData);
          setSuccessMessage("Successfully updated conversation class details");
          await fetchConversation();
          setTimeout(() => {
            setSuccessMessage("");
          }, 4000);
          setIsSaving(false);
        }
      }
    } catch (error) {
      setIsSaving(false);
      console.error('Error updating conversation:', error);
      setAlertMessage(`Error: ${error.response.data.message}`);
      setTimeout(() => {
        setAlertMessage("");
      }, 4000);
    }
  }

  const handleOpenOrCloseEnrollment = async () => {
    try {
      await updateConversation(conversationObj._id, {
        isEnrollmentOpen: !conversationObj.isEnrollmentOpen
      });
      await fetchConversation();
    } catch (error) {
      console.error('Error changing enrollment status:', error);
      setAlertMessage(`Error changing enrollment status`);
      setTimeout(() => {
        setAlertMessage("");
      }, 4000);
    }
  }

  const handleDeleteConversation = async () => {
    try {
      await deleteConversation(params.id);
      history.back();
    } catch (error) {
      console.error('Error deleting conversation:', error);
      setAlertMessage(`Error: ${error.response.data.message}`)
      setTimeout(() => {
        setAlertMessage("")
      }, 4000);
    }
  }

  const handleReset = () => {
    setConversationData(prev => ({
      ageGroup: conversationObj.ageGroup,
      instructor: conversationObj.instructor,
      schedule: conversationObj.schedule.length !== 0 ? conversationObj.schedule : prev.schedule,
      image: conversationObj.image
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
        <BackButton label="All Conversations" />
        <div className="space-y-2">
          <h1 className="font-extrabold">Edit Conversation Class</h1>
          <h3 className="font-light text-base sm:text-lg">Edit conversation class and student information</h3>
        </div>
        <div className="space-y-3">
          <h2>Conversation Class Preview</h2>
          <div className="w-full md:w-1/3">
            <SupplementaryClassPreview
              cls={conversationData}
            />
          </div>
          <Button label="Select Image" onClick={() => setIsOpenImagePicker(true)} />
        </div>
        <form onSubmit={handleEditConversation} className="w-full lg:w-2/3">
          <div className="grid grid-cols-2 gap-x-10 w-full mb-6">
            <div className="w-full space-y-3">
              <label className="mx-1">Age Group</label>
              <FormInput
                type="text"
                name="ageGroup"
                placeholder="Age Group"
                value={conversationData.ageGroup}
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
                value={conversationData.instructor}
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
              value={conversationData.link}
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
              {conversationData.schedule.map((time, index) => {
                const handleTimeInputChange = (e) => {
                  const updatedTimeArray = [...conversationData.schedule];
                  updatedTimeArray[index] = {
                    ...updatedTimeArray[index],
                    [e.target.name]: e.target.value,
                  };
                  setConversationData({
                    ...conversationData,
                    schedule: updatedTimeArray,
                  });
                };
                const handleSelectedDay = (day) => {
                  const updatedTimes = [...conversationData.schedule];
                  updatedTimes[index] = {
                    ...updatedTimes[index],
                    day,
                  };
                  setConversationData(prev => ({
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
                        setConversationData(prevData => ({
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
              setConversationData(prevData => ({
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
        <div>
          <div className="flex items-center gap-8 mb-2">
            <h2>List of Students</h2>
            {allowRender && <Button
              label={conversationObj.isEnrollmentOpen ? "Close Enrollment" : "Open Enrollment"}
              isOutline={!conversationObj.isEnrollmentOpen}
              onClick={handleOpenOrCloseEnrollment}
            />}
          </div>
          <div className="text-indigo-900 inline-flex gap-x-2 items-center mb-6">
            <IoPersonOutline />
            <p>{students.length} enrolled</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-14 gap-y-3">
            {allowRender
              ? (students.map(student => (
                <Link key={student._id} href={`/admin/user/${encodeURIComponent(student._id)}`}>
                  <UserItem
                    userData={student}
                    privilege="admin"
                  />
                </Link>
              ))
              )
              : showSkeleton && <SkeletonUser count={3} />}
          </div>
        </div>
        <DeleteButton item="conversation class" onDelete={handleDeleteConversation} />
      </div>
      {isOpenImagePicker && <ImagePicker
        images={levelImgs}
        selectedImage={conversationData.image}
        setImage={(newImage) => {
          setConversationData(prev => ({ ...prev, image: newImage }));
        }}
        setPickerOpen={setIsOpenImagePicker}
      />}
    </>
  )
}

export default EditConversation;