import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams, Link } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getLevelById, updateLevel, deleteLevel, getClasses } from '@/api/class-wrapper.js';
import Button from '@/components/Button/Button';
import BackButton from "@/components/Button/BackButton";
import Class from '@/components/Class/Class';
import FormInput from '@/components/Form/FormInput';

const EditLevel = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const params = useParams();

  const [level, setLevel] = useState();
  const [classes, setClasses] = useState();
  const [levelData, setLevelData] = useState({ level: '', name: '', description: '', skills: [] });
  const [skillsInput, setSkillsInput] = useState(''); // Separate state for skills input field

  useEffect(() => {
    if (!params.id) {
      console.log("Redirecting: No levelId provided");
      setLocation("/admin/levels");
      return;
    }

    if (isLoaded) {
      if (!isSignedIn) {
        console.log("Redirecting: User not signed in");
        setLocation("/login");
      } else {
        fetchLevels();
        setAllowRender(true);
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const fetchLevels = async () => {
    try {
      const levelRes = await getLevelById(params.id);
      setLevel(levelRes);
      const classRes = await getClasses(`level=${levelRes.level}`);
      console.log(levelRes.level)
      setClasses(classRes);

      const skills = Array.isArray(levelRes.skills) ? levelRes.skills : [];

      setLevelData({
        level: levelRes.level,
        name: levelRes.name,
        description: levelRes.description || '',
        skills: skills
      });

      console.log(classes)

      // Initialize the skills input field
      setSkillsInput(skills.join(', '));
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };

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
      e.preventDefault();

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

  const handleEditLevel = async (e) => {
    e.preventDefault();
    console.log("Submitting level update:", levelData);
    try {
      await updateLevel(params.id, levelData);
      console.log("Level updated successfully");
      await fetchLevels();
    } catch (error) {
      console.error("Error updating level:", error);
    }
  };

  const handleDeleteLevel = async () => {
    try {
      console.log("Deleting level:", params.id);
      await deleteLevel(params.id);
      setLocation("/admin/levels");
    } catch (error) {
      console.error("Error deleting level:", error);
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
    setLocation("/admin/levels");
  };

  if (!allowRender || !level) {
    return <div>Loading...</div>;
  }

  if (user.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="page-format space-y-10">
      <BackButton label="All Levels" href="/admin/levels" />
      <h3 className="font-extrabold">Edit Level</h3>
      <div className="text-lg text-gray-600">
        Edit Level information and view all the classes in this level.
      </div>
      <form onSubmit={handleEditLevel} className="space-y-6">
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
      <div>
        <div className="flex justify-between">
          <h4>Classes in this Level</h4>
          <Button label="+ Add Class" onClick={() => { setLocation("") }} isOutline /> {/* when clicking add class, should take to edit class with level set in form */}
        </div>
        <div className="grid grid-cols-3 gap-6">
          { }
        </div>
      </div>

      <Button label="Delete Level" onClick={handleDeleteLevel} />
    </div>
  );
};

export default EditLevel;