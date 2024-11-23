import { useState, useEffect } from 'react';
import { useSearch, useLocation } from 'wouter';
import Class from '../components/Class';
import { getClasses, getLevels } from '../api/class-wrapper';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [level, setLevel] = useState()
  const [loading, setLoading] = useState(true)
  const queryString = useSearch()
  const [, setLocation] = useLocation()
  const classFilter = new URLSearchParams(queryString)

  useEffect(() => {
    // make sure level query exists otherwise redirect to level page
    if (queryString === "") {
      setLocation("/levels")
    }

    const fetchData = async () => {
      setLoading(true)
      // fetch classes
      const classData = await getClasses(classFilter.toString())
      setClasses(classData);
      // fetch level
      const levelData = await getLevels(classFilter.toString())
      setLevel(levelData[0])
      setLoading(false)
    }
    fetchData();
  }, []);

  if (loading || !level) {
    return <></>
  }

  return (
    <div className='px-8 py-6'>
      <h3>Level {level.level}</h3>
      <h1 className='text-4xl font-extrabold'>{level.name}</h1>
      <div className='flex gap-3 mt-4'>
        {classes.map((classObj, classIndex) => (
          <Class key={classIndex} classObj={classObj} />
        ))}
      </div>
    </div>
  );
}

export default Classes