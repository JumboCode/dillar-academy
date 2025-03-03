import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams, Link } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getLevelById, updateLevel, deleteLevel } from '@/api/class-wrapper.js';
import Button from '@/components/Button/Button';
import FormInput from '@/components/Form/FormInput';

const EditLevel = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const params = useParams();
  
  console.log("Params:", params);

  const [level, setLevel] = useState();
  const [levelData, setLevelData] = useState({ level: '', name: '' });

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
        if (params.id != "new"){
          fetchLevels(); //Fetch level only if it's not new
        }
        setAllowRender(true);
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const fetchLevels = async () => {
    try {
      const data = await getLevelById(params.id);
      console.log("Fetched level data:", data);
      setLevel(data);
      setLevelData({ level: data.level, name: data.name });
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };

  const handleLevelChange = (e) => {
    setLevelData({
      ...levelData,
      [e.target.name]: e.target.value,
    });
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

  if (!allowRender && !level) {
    return <div>Loading...</div>;
  }

  if (user?.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="h-full p-8 space-y-10">
      <Link to="/admin/levels" className="cursor-pointer hover:underline text-blue-500">
        ← All Levels
      </Link>
      <h3 className="font-extrabold">Edit Level</h3>
      <div className="text-lg text-gray-600">
        Edit Level information and view all the classes in this level.
      </div>
      <form onSubmit={handleEditLevel} className="space-y-4">
        <FormInput
          type="text"
          name="level"
          placeholder="Level"
          value={levelData.level}
          onChange={handleLevelChange}
          isRequired={true}
        />
        <FormInput
          type="text"
          name="name"
          placeholder="Name"
          value={levelData.name}
          onChange={handleLevelChange}
          isRequired={true}
        />
        <div className="flex justify-end space-x-2">
          <Button label="Cancel" onClick={() => 
            setLevelData({ level: level.level, name: level.name })} />
          <Button label="Save" type="submit" />
        </div>
      </form>
      <Button label="Delete" onClick={handleDeleteLevel} />
    </div>
  );
};

export default EditLevel;
