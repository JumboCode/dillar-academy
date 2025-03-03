import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams, Link } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getLevelById, updateLevel, deleteLevel } from '@/api/class-wrapper.js';
import Button from '@/components/Button/Button';

const EditLevel = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const params = useParams();
  
  const [level, setLevel] = useState();
  const [levelData, setLevelData] = useState({ level: '', name: '', description: '', skills: [] });

  useEffect(() => {
    if (!params.id) {
      setLocation("/admin/levels");
      return;
    }

    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        fetchLevels();
        setAllowRender(true);
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const fetchLevels = async () => {
    try {
      const data = await getLevelById(params.id);
      setLevel(data);
      setLevelData({ 
        level: data.level, 
        name: data.name, 
        description: data.description || '', 
        skills: data.skills || []
      });
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
    try {
      await updateLevel(params.id, levelData);
      await fetchLevels();
    } catch (error) {
      console.error("Error updating level:", error);
    }
  };

  const handleDeleteLevel = async () => {
    try {
      await deleteLevel(params.id);
      setLocation("/admin/levels");
    } catch (error) {
      console.error("Error deleting level:", error);
    }
  };

  if (!allowRender || !level) {
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
      <h3 className="font-extrabold text-2xl">Edit Level</h3>
      <div className="text-lg text-gray-600">
        Edit Level information and view all the classes in this level.
      </div>
      
      <form onSubmit={handleEditLevel} className="space-y-4">
        {/* Level and Name fields on the same line */}
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

        {/* Larger description field */}
        <div>
          <label className="block text-sm font-semibold mb-1">Description</label>
          <textarea
            name="description"
            className="w-full p-2 border border-gray-300 rounded-md h-28 resize-none"
            value={levelData.description}
            onChange={handleLevelChange}
          />
        </div>

        {/* Skills field */}
        <div>
          <label className="block text-sm font-semibold mb-1">Relevant Skills</label>
          <input
            type="text"
            name="skills"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={levelData.skills}
            onChange={handleLevelChange}
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-2">
          <Button label="Cancel" onClick={() => setLevelData({ level: level.level, name: level.name, description: level.description || '', skills: level.skills || [] })} />
          <Button label="Save" type="submit" />
        </div>
      </form>
      <Button label="Delete" onClick={handleDeleteLevel} />
    </div>
  );
};

export default EditLevel;
