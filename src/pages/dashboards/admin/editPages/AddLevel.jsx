import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import Button from '@/components/Button/Button';

const AddLevel = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
 
  
  const [level, setLevel] = useState();
  const [levelData, setLevelData] = useState({ level: '', name: '', description: '', skills: [] });
  const [skillsInput, setSkillsInput] = useState(''); // Separate state for skills input field

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        console.log("Redirecting: User not signed in");
        setLocation("/login");
      } else {
        setAllowRender(true);
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const handleLevelChange = (e) => {
    console.log(`Updating ${e.target.name}:`, e.target.value);
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
    console.log("Submitting level update:", levelData);
    try {
      console.log("Level updated successfully");
    } catch (error) {
      console.error("Error updating level:", error);
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
  };

  if (user?.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="h-full p-8 space-y-10">
      <Link to="/admin/levels" className="cursor-pointer hover:underline text-blue-500">
        ← All Levels
      </Link>
      <h3 className="font-extrabold">Add Level</h3>
      <div className="text-lg text-gray-600">
        Add level information and view all the classes in this level.
      </div>
      <form onSubmit={handleAddLevel} className="space-y-4">
        {/* Level and Name fields */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Level</label>
            <input
              type="text"
              name="level"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={levelData.level}
              onChange={handleLevelChange}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={levelData.name}
              onChange={handleLevelChange}
              required
            />
          </div>
        </div>

        {/* Description field */}
        <div>
          <label className="block text-sm font-semibold mb-1">Description</label>
          <textarea
            name="description"
            className="w-full p-2 border border-gray-300 rounded-md h-28 resize-none"
            value={levelData.description}
            onChange={handleLevelChange}
          />
        </div>

        {/* Skills field with deletable tags */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Relevant Skills
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={skillsInput}
            onChange={handleSkillsInputChange}
            onKeyDown={handleSkillsInputKeyDown}
            placeholder="Ex. the alphabet, simple vocabulary, basic conversation"
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
        <div className="flex justify-end space-x-2">
          <Button label="Cancel" onClick={handleCancel} />
          <Button label="Save" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default AddLevel;