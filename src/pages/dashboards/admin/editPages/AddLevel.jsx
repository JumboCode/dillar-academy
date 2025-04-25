import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { createLevel } from '@/api/class-wrapper.js';
import { useAuth } from '@clerk/clerk-react';
import { useTranslation } from "react-i18next";
import Button from '@/components/Button/Button';
import FormInput from '@/components/Form/FormInput';
import BackButton from "@/components/Button/BackButton";
import Alert from "@/components/Alert";
import Unauthorized from "@/pages/Unauthorized";

const AddLevel = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [levelData, setLevelData] = useState({ level: '', name: '', description: '', skills: [] });
  const [skillsInput, setSkillsInput] = useState(''); // Separate state for skills input field
  const [alertMessage, setAlertMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        console.log("Redirecting: User not signed in");
        setLocation("/login");
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const handleLevelChange = (e) => {
    setLevelData({
      ...levelData,
      [e.target.name]: e.target.value,
    });
  };

  // Separate handler for skills input
  const handleSkillsInputChange = (e) => {
    const inputValue = e.target.value;
    setSkillsInput(inputValue);

    // Update the actual skills array in levelData
    // Split by commas and trim whitespace
    const skillsArray = inputValue.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
    setLevelData({
      ...levelData,
      skills: skillsArray
    });
  };

  // Function to handle adding a skill when pressing Enter
  const handleSkillsInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission

      const newSkill = skillsInput.trim();
      if (newSkill && !levelData.skills.includes(newSkill)) {
        const newSkills = [...levelData.skills, newSkill];
        setLevelData({
          ...levelData,
          skills: newSkills
        });
        setSkillsInput(''); // Clear the input field
      }
    }
  };

  // Function to remove a skill tag
  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = levelData.skills.filter(skill => skill !== skillToRemove);
    setLevelData({
      ...levelData,
      skills: updatedSkills
    });

    // Update the input field to reflect the current skills
    setSkillsInput(updatedSkills.join(', '));
  };

  const handleAddLevel = async (e) => {
    e.preventDefault();
    try {
      if (isNaN(parseFloat(levelData.level))) {
        setAlertMessage(`Error: Level input must be a number`)
        setTimeout(() => {
          setAlertMessage("");
        }, 4000);
      } else {
        setIsSaving(true);
        await createLevel(levelData);
        await i18n.reloadResources();
        setLocation("/admin/levels");
      }
    } catch (error) {
      console.error("Error adding level:", error);
      setAlertMessage(`Error: ${error.response.data.message}`);
      setTimeout(() => {
        setAlertMessage("");
      }, 4000);
    }
  };

  if (user && user.privilege !== "admin") {
    return <Unauthorized />;
  }

  return (
    <>
      {alertMessage !== "" && <Alert message={alertMessage} />}
      <div className="page-format max-w-[96rem] space-y-10">
        <BackButton label="All Levels" />
        <div>
          <h1 className="font-extrabold mb-2">Add Level</h1>
          <p className="sm:text-lg">Add level information and view all the classes in this level.</p>
        </div>
        <form onSubmit={handleAddLevel} className="space-y-6 w-2/3">
          {/* Level and Name fields */}
          <div className="flex flex-col lg:flex-row gap-x-6">
            <div className="space-y-2">
              <label>Level</label>
              <FormInput
                type="text"
                name="level"
                placeholder="Level"
                value={levelData.level}
                onChange={handleLevelChange}
                isRequired={true}
              />
            </div>
            <div className="flex-1 space-y-2">
              <label>Name</label>
              <FormInput
                type="text"
                name="name"
                placeholder="Name"
                value={levelData.name}
                onChange={handleLevelChange}
                isRequired={true}
              />
            </div>
          </div>
          {/* Description field */}
          <div className="space-y-2">
            <label>Description</label>
            <FormInput
              type="textarea"
              name="description"
              placeholder="Description"
              value={levelData.description}
              onChange={handleLevelChange}
              isRequired={true}
            />
          </div>
          {/* Skills field with deletable tags */}
          <div className="space-y-2">
            <label>Relevant Skills</label>
            <FormInput
              type="text"
              name="skills"
              placeholder="Use commas to separate skills (Ex. the alphabet, simple vocabulary, basic conversation)"
              value={skillsInput}
              onChange={handleSkillsInputChange}
              onKeyDown={handleSkillsInputKeyDown}
            />
            {/* Display the current skills as deletable tags */}
            <div className="mt-2 flex flex-wrap gap-2">
              {levelData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-gray-100 px-2 py-1 rounded text-sm flex items-center group"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    className="ml-2 text-gray-500 hover:text-red-500 focus:outline-none"
                    onClick={() => handleRemoveSkill(skill)}
                    aria-label={`Remove ${skill}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* TODO: change text to saving... when in the process of saving level */}
          <Button label={isSaving ? "Saving..." : "Save"} type="submit" isDisabled={isSaving} />
        </form>
      </div>
    </>
  );
};

export default AddLevel;