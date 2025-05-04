import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import FormInput from '@/components/Form/FormInput'
import Button from '@/components/Button/Button';
import DayDropdown from '@/components/Dropdown/DayDropdown';
import BackButton from "@/components/Button/BackButton";
import Alert from '@/components/Alert';
import { createConversation } from '@/wrappers/conversation-wrapper.js';
import { IoAdd, IoTrashBinOutline } from "react-icons/io5";
import Unauthorized from "@/pages/Unauthorized";

const AddConversation = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [alertMessage, setAlertMessage] = useState("")
  const [conversationData, setConversationData] = useState({
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

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      }
    }

  }, [isLoaded, isSignedIn, user]);

  const handleInputChange = (e) => {
    setConversationData({
      ...conversationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateConversation = async (e) => {
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
        // Filter out any time objects that are empty (i.e., missing a day or time)
        const filteredConversationData = {
          ...conversationData,
          schedule: conversationData.schedule.filter(time => time.day && time.startTime),
        };
        await createConversation(filteredConversationData);
        history.back();
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      setAlertMessage(`Error: ${error.response.data.message}`);
      setTimeout(() => {
        setAlertMessage("")
      }, 4000);
    }
  }

  if (user && user.privilege !== "admin") {
    return <Unauthorized />;
  }

  return (
    <>
      {alertMessage !== "" && <Alert message={alertMessage} />}
      <div className="page-format max-w-[96rem] space-y-10">
        <BackButton label={"All Conversations"} />
        <div className="space-y-2">
          <h1 className="font-extrabold">Add Conversation Class</h1>
          <p className="font-light text-base sm:text-lg">Fill out new conversation class data</p>
        </div>
        <form onSubmit={handleCreateConversation} className="w-full lg:w-2/3">
          <div className="flex justify-start space-x-10 w-full mb-6">
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
          <div className="w-fit grid grid-cols-2 gap-x-2 mt-8">
            <Button
              label="Save" type="submit" />
            <Button
              label="Cancel"
              isOutline={true}
              onClick={() => setLocation("/admin/levels/conversations")} />
          </div>
        </form>
      </div>
    </>
  )
}

export default AddConversation;