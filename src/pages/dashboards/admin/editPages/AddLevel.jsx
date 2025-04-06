import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { createLevel } from '@/api/class-wrapper.js';
import { useAuth } from '@clerk/clerk-react';
import Button from '@/components/Button/Button';
import FormInput from '@/components/Form/FormInput';
import BackButton from "@/components/Button/BackButton";

const AddLevel = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [levelData, setLevelData] = useState({ level: '', name: '', description: '', skills: [] });
  const [skillsInput, setSkillsInput] = useState(''); // Separate state for skills input field

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
    console.log("Creating level:", levelData);
    try {
      await createLevel(levelData);
      console.log("Level added successfully");
      setLocation("/admin/levels");
    } catch (error) {
      console.error("Error adding level:", error);
    }
  };

  const handleCancel = () => {
    const skills = Array.isArray(level.skills) ? level.skills : [];
    setLevelData({
      level: level.level,
      name: level.name,
      description: level.description || '',
      skills: skills
    });
    setSkillsInput(skills.join(', '));
    setLocation("/admin/levels")
  };

  if (user?.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="page-format max-w-[96rem] space-y-8">
      <BackButton label="All Levels" />
      <h1 className="font-extrabold">Add Level</h1>
      <div className="sm:text-lg text-gray-600">
        Add level information and view all the classes in this level.
      </div>
      <form onSubmit={handleAddLevel} className="space-y-6">
        {/* Level and Name fields */}
        <div className="flex gap-x-6">
          <div className="flex-1 gap-y-2">
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
          <div className="flex-1 gap-y-2">
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
            placeholder="Ex. the alphabet, simple vocabulary, basic conversation"
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
        {/* Action buttons */}
        <div className="flex gap-x-2">
          <Button label="Save" />
          <Button label="Cancel" onClick={handleCancel} isOutline />
        </div>
      </form>
    </div>
  );
};
//need to make sure the save button actually saves

export default AddLevel;