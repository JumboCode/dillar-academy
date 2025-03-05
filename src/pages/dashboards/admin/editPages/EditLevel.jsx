import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getClasses, getLevels, createClass, deleteClass } from '@/api/class-wrapper.js';
import Button from '@/components/Button/Button';
import Class from '@/components/Class';
import Form from '@/components/Form/Form'
import FormInput from '@/components/Form/FormInput'

const EditLevel = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);

  const params = useParams();
  const levelNum = decodeURIComponent(params.id);
  const [level, setLevel] = useState();
  const [classes, setClasses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [classData, setClassData] = useState({
    level: '',
    ageGroup: '',
    instructor: '',
  });

  useEffect(() => {
    if (params === "" || levelNum === "") {
      setLocation("/admin/levels");
    }

    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        setAllowRender(true);
      }
    }
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const levelData = await getLevels();
        const thisLevel = levelData.find(l => l.level === parseInt(levelNum));
        if (thisLevel && thisLevel !== level) {
          setLevel(thisLevel);
        }
      } catch (error) {
        console.error('Error fetching levels:', error);
      }
    }

    if (allowRender) {
      fetchLevel();
      fetchClasses();
    }
  }, [allowRender]);

  const fetchClasses = async () => {
    try {
      const classFilter = new URLSearchParams(`level=${levelNum}`);
      const data = await getClasses(classFilter);
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleInputChange = (e) => {
    setClassData({
      ...classData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await createClass(classData);
      setShowCreateModal(false);
      setClassData({ level: '', ageGroup: '', instructor: '' });
      await fetchClasses();
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      await deleteClass(classId);
      await fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  }

  if (!allowRender || !level) {
    return <div></div>;
  }

  if (user.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="page-format space-y-10">
      <h3 className="font-extrabold">Edit Level</h3>
      <div>
        <p>Level {level.level}</p>
        <p>Name {level.name}</p>
      </div>
      <section>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">Class Management</h1>
          <Button
            label="Create Class"
            onClick={() => setShowCreateModal(true)}
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {classes.map((classObj, classIndex) => (
            <Class key={classIndex} classObj={classObj} modes={["edit", "delete"]} editURL={`/admin/class`} />
          ))}
        </div>
      </section>

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Form width="w-1/2">
            <h2 className="text-2xl font-bold mb-6">Create New Class</h2>
            <form onSubmit={handleCreateClass} className="space-y-3">
              <FormInput
                type="text"
                name="level"
                placeholder="Level"
                value={classData.level}
                onChange={handleInputChange}
                isRequired={true}
              />
              <FormInput
                type="text"
                name="ageGroup"
                placeholder="Age Group"
                value={classData.ageGroup}
                onChange={handleInputChange}
                isRequired={true}
              />
              <FormInput
                type="text"
                name="instructor"
                placeholder="Instructor"
                value={classData.instructor}
                onChange={handleInputChange}
                isRequired={true}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  label="Cancel"
                  isOutline={true}
                  onClick={() => {
                    setShowCreateModal(false);
                    setClassData({ level: '', ageGroup: '', instructor: '' });
                  }}
                />
                <Button label="Create" type="submit" />
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  )
}

export default EditLevel;