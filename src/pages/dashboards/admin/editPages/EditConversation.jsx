import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getConversationById } from "@/api/class-wrapper";
import FormInput from '@/components/Form/FormInput'
import Button from '@/components/Button/Button';
import DayDropdown from '@/components/Dropdown/DayDropdown';
import BackButton from "@/components/Button/BackButton";
import Alert from '@/components/Alert';
import { updateConversation, deleteConversation } from '@/api/class-wrapper.js';
import { IoAdd, IoTrashBinOutline } from "react-icons/io5";
import DeletePopup from "../../../../components/delete";

const EditConversation = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [alertMessage, setAlertMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [conversationObj, setConversationObj] = useState(null)
  const [showPopup, setShowPopup] = useState(false);
  const [conversationData, setConversationData] = useState({
    ageGroup: '',
    instructor: '',
    schedule: [
      {
        day: '',
        time: ''
      }
    ]
  });
  const params = useParams();

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
        schedule: conversationData.schedule
      });
      if (data.schedule.length !== 0) {
        setConversationData(prev => ({
          ...prev,
          schedule: data.schedule
        }))
      }
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
        // Filter out any time objects that are empty (i.e., missing a day or time)
        const filteredConversationData = {
          ...conversationData,
          schedule: conversationData.schedule.filter(time => time.day && time.time),
        };

        await updateConversation(params.id, filteredConversationData);
        setSuccessMessage("Successfully updated conversation class details");
        await fetchConversation();
        setTimeout(() => {
          setSuccessMessage("");
        }, 4000);
      }
    } catch (error) {
      console.error('Error updating conversation:', error);
      setAlertMessage(`Error: ${error.response.data.message}`);
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
    setConversationData({
      ageGroup: conversationObj.ageGroup,
      instructor: conversationObj.instructor,
      schedule: conversationData.schedule
    });
    if (conversationObj.schedule.length !== 0) {
      setConversationData(prev => ({
        ...prev,
        schedule: conversationObj.schedule
      }))
    }
  }

  if (!allowRender || !conversationObj) {
    return <div></div>;
  }

  if (user.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <>
      {alertMessage !== "" && <Alert message={alertMessage} />}
      {successMessage !== "" && <Alert message={successMessage} isSuccess />}
      <div className="page-format max-w-[96rem] space-y-10">
        <BackButton label="All Conversations" />
        <div className="space-y-2">
          <h1 className="font-extrabold">Edit Conversation Class</h1>
          <h3 className="font-light">Edit conversation class and student information</h3>
        </div>
        <form onSubmit={handleEditConversation} className="w-2/3">
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
                            name="time"
                            placeholder="Start Time"
                            value={time.time}
                            onChange={handleTimeInputChange}
                            isRequired={false}
                          />
                          {/* <p className="text-3xl">-</p>
                            <FormInput
                              type="text"
                              name="endTime"
                              value={conversationData.time}
                              onChange={handleInputChange}
                              isRequired={false}
                            /> */}
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
                  { day: '', time: '' }
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
        <Button label="Delete Conversation" onClick={() => setShowPopup(true)} />
      </div>
      {showPopup &&
      <DeletePopup 
        itemName = {"Conversation with " + conversationData.instructor}
        onDelete = {handleDeleteConversation}
        setShowPopup={setShowPopup}
      />}

    </>
  )
}

export default EditConversation;