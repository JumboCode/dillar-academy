import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getConversationById } from "@/api/class-wrapper";
import FormInput from '@/components/Form/FormInput'
import Button from '@/components/Button/Button';
import DateDropdown from '@/components/Dropdown/DateDropdown'
import { updateConversation, deleteConversation } from '@/api/class-wrapper.js';
import { IoChevronBack } from "react-icons/io5";

const EditConversation = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [conversationObj, setConversationObj] = useState(null)
  const [conversationData, setConversationData] = useState({
    ageGroup: '',
    instructor: '',
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
        setAllowRender(true);
      }
    }

  }, [isLoaded, isSignedIn, user]);

  const fetchConversation = async () => {
    try {
      const data = await getConversationById(params.id);
      setConversationObj(data);
      setConversationData({
        ageGroup: data.ageGroup,
        instructor: data.instructor
      });
      setConversationData({ ageGroup: data.ageGroup, instructor: data.instructor })
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
    try {
      await updateConversation(params.id, conversationData);
      await fetchConversation();
      setLocation("/admin/levels/conversations")
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  }

  const handleDeleteConversation = async () => {
    try {
      await deleteConversation(params.id);
      setLocation("/admin/levels/conversations")
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }

  if (!allowRender || !conversationObj) {
    return <div></div>;
  }

  if (user.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="page-format space-y-12">
      <button className="flex items-center" onClick={() => setLocation("/admin/levels/conversations")}>
        <IoChevronBack className="mr-4" />
        <p className="font-light">All Conversations</p>
      </button>
      <div className="space-y-2">
        <h3 className="font-extrabold">Edit Conversation Class</h3>
        <h5 className="font-light">Edit conversation class and student information</h5>
      </div>

      <form onSubmit={handleEditConversation}>
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
          <Button label="Save"
            type="submit" />
          <Button
            label="Cancel"
            isOutline={true}
            onClick={() => setLocation("/admin/levels/conversations")} />
        </div>
      </form>

      <Button label="Delete Conversation" onClick={handleDeleteConversation} />

    </div>
  )
}

export default EditConversation;