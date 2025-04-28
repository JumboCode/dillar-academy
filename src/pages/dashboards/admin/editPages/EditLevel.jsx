import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { useTranslation } from "react-i18next";
import { getLevels, updateLevel, deleteLevel, getClasses, deleteClass } from '@/api/class-wrapper.js';
import Button from '@/components/Button/Button';
import DeleteButton from "@/components/Button/DeleteButton";
import BackButton from "@/components/Button/BackButton";
import Class from '@/components/Class/Class';
import FormInput from '@/components/Form/FormInput';
import Overlay from '@/components/Overlay';
import Alert from '@/components/Alert';
import Unauthorized from "@/pages/Unauthorized";
import SkeletonClass from "@/components/Skeletons/SkeletonClass";
import useDelayedSkeleton from '@/hooks/useDelayedSkeleton';

const EditLevel = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const params = useParams();
  const levelNum = params.id
  const { t, i18n } = useTranslation();

  const [level, setLevel] = useState([]);
  const [classes, setClasses] = useState([]);
  const [levelData, setLevelData] = useState({ level: '', name: '', description: '', skills: [] });
  const [skillsInput, setSkillsInput] = useState(''); // Separate state for skills input field
  const [alertMessage, setAlertMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const showSkeleton = useDelayedSkeleton(!allowRender);

  useEffect(() => {
    if (!params.id || !levelNum) {
      setLocation("/admin/levels");
      return;
    }

    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        fetchLevels();
      }
    }
  }, [isLoaded, isSignedIn, user, levelNum]);

  useEffect(() => {
    if (level) {
      const skills = Array.isArray(level.skills) ? level.skills : [];
      setLevelData({
        level: level.level || '',
        name: level.name || '',
        description: level.description || '',
        skills: skills
      });

      // Initialize the skills input field
      setSkillsInput(skills.join(', '));
    }
  }, [level]);

  const fetchLevels = async () => {
    if (user) {
      const levelRes = await getLevels(`level=${levelNum}`);
      if (levelRes.length === 0) {
        setLocation("/admin/levels");
      }
      setLevel(levelRes[0]);
      const classRes = await getClasses(`level=${levelNum}`);
      setClasses(classRes);
      setAllowRender(true);
    }
  };

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
    try {
      if (!Number(levelData.level)) {
        setAlertMessage(`Error: Level input must be a number`)
        setTimeout(() => {
          setAlertMessage("")
        }, 4000);
      } else {
        setIsSaving(true);
        await updateLevel(level._id, levelData);
        setSuccessMessage("Successfully updated level details");
        setLocation(`/admin/levels/${levelData.level}`, { replace: true })
        setTimeout(() => {
          setSuccessMessage("");
        }, 4000);
        await i18n.reloadResources();
        setIsSaving(false);
      }
    } catch (error) {
      setIsSaving(false);
      console.error("Error updating level:", error);
      setAlertMessage(`Error: ${error.response.data.message}`);
      setTimeout(() => {
        setAlertMessage("");
      }, 4000);
    }
  };

  const handleDeleteLevel = async (shouldDeleteClasses = false) => {
    try {
      console.log(classes.length)
      await deleteLevel(level._id);
      if (shouldDeleteClasses) {
        console.log("deleteClass")
        await Promise.all(
          classes.map(cls => deleteClass(cls._id))
        );
      }
      setLocation("/admin/levels");
    } catch (error) {
      console.error("Error deleting level:", error);
      setAlertMessage(`Error: ${error.response.data.message}`);
      setTimeout(() => {
        setAlertMessage("");
      }, 4000);
    }
  };

  const handleReset = () => {
    const skills = Array.isArray(level.skills) ? level.skills : [];
    setLevelData({
      level: level.level,
      name: level.name,
      description: level.description || '',
      skills: skills
    });
    setSkillsInput(skills.join(', '));
  };

  if (user && user.privilege !== "admin") {
    return <Unauthorized />;
  }

  return (
    <>
      {alertMessage !== "" && <Alert message={alertMessage} />}
      {successMessage !== "" && <Alert message={successMessage} isSuccess />}
      <div className="page-format max-w-[96rem] space-y-10">
        <BackButton label="All Levels" />
        <div>
          <h1 className="font-extrabold mb-2">Edit Level</h1>
          <p className="sm:text-lg">Edit Level information and view all the classes in this level.</p>
        </div>
        <form onSubmit={handleEditLevel} className="space-y-6 w-full lg:w-2/3">
          {/* Level and Name fields */}
          <div className="flex flex-col lg:flex-row gap-x-6 w-full">
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
            <Button label={isSaving ? "Saving..." : "Save"} type="submit" isDisabled={isSaving} />
            <Button label="Reset" onClick={handleReset} isOutline />
          </div>
        </form>
        <div>
          <div className="flex justify-between mb-4">
            <h2>Classes in this Level</h2>
            <Button label="+ Add Class" onClick={() => setLocation("/admin/class/new")} isOutline />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allowRender
              ? classes.length > 0 ? (
                classes.map((classObj) => (
                  <Class key={classObj._id} classObj={classObj} modes={["edit"]} editURL={`/admin/class`} />
                ))
              ) : (
                <p className="text-gray-500">{t("no_classes_available")}</p>
              )
              : showSkeleton && <SkeletonClass count={3} />}
          </div>
        </div>
        <DeleteButton item={`level`} onDelete={() => classes.length !== 0 ? setShowDeletePopup(true) : handleDeleteLevel()} />

        {showDeletePopup && <Overlay width={"w-fit"}>
          <div className="mb-1">
            <h3 className="font-extrabold">Delete Level's Classes?</h3>
            <p className='text-base sm:text-lg'>
              This level has {classes.length} classes. Do you want to delete them as well?
            </p>
          </div>
          <div className="grid grid-cols-3 w-fit gap-x-2">
            <Button
              label="Delete Classes"
              onClick={() => {
                handleDeleteLevel(true);
              }}
            />
            <Button
              label="Keep Classes"
              isOutline
              onClick={handleDeleteLevel}
            />
            <Button
              label="Abort Delete"
              onClick={() => setShowDeletePopup(false)}
            />
          </div>
        </Overlay>}
      </div>
    </>
  );
};

export default EditLevel;