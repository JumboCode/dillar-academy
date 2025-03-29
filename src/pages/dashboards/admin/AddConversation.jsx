import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import FormInput from '@/components/Form/FormInput'
import Button from '@/components/Button/Button';
import DateDropdown from '@/components/Dropdown/DateDropdown';
import BackButton from "@/components/Button/BackButton";
import { createConversation } from '@/api/class-wrapper.js';

const EditConversation = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [selectedDates, setSelectedDates] = useState([]);

  const params = useParams();
  const [conversationData, setConversationData] = useState({
    ageGroup: '',
    instructor: '',
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
    try {
      await createConversation(conversationData);
      setLocation("/admin/levels/conversations")
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  }

  if (user?.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="page-format max-w-[96rem] space-y-12">
      <BackButton label={"All Conversations"} />
      <div className="space-y-2">
        <h3 className="font-extrabold">Add Conversation Class</h3>
        <h5 className="font-light">Add a new conversation class</h5>
      </div>

      <form onSubmit={handleCreateConversation}>
        <div className="flex justify-start space-x-10 w-2/3 mb-6">
          <div className="w-2/3 space-y-3">
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
          <div className="w-2/3 space-y-3">
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

        <div className="flex justify-start space-x-10 w-2/3">
          <div className="w-2/3 space-y-3">
            <label className="mx-1">Dates</label>
            <DateDropdown selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
          </div>
          <div className="w-2/3">
            <label className="mx-1">Time</label>
            <div className="flex space-x-4 mt-3 items-center">
              <FormInput
                type="text"
                name="startTime"
                placeholder="Start"
                // value={conversationData.instructor}
                // onChange={handleInputChange}
                isRequired={false}
              />
              <p className="text-3xl">-</p>
              <FormInput
                type="text"
                name="endTime"
                placeholder="End"
                // value={conversationData.instructor}
                // onChange={handleInputChange}
                isRequired={false}
              />
            </div>
          </div>
        </div>

        <div className="space-x-2 mt-8">
          <Button
            label="Save" type="submit" />
          <Button
            label="Cancel"
            isOutline={true}
            onClick={() => setLocation("/admin/levels/conversations")} />
        </div>
      </form>

    </div>
  )
}

export default EditConversation;