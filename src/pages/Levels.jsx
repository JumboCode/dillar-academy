import axios from 'axios';
import { useState, useEffect } from 'react';
import Level from '@/components/Level'
import { getLevels } from '../api/class-wrapper';

const Levels = () => {
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    const fetchLevels = async () => {
      const levels = await getLevels()
      setLevels(levels)
    };
    fetchLevels();
  }, []);

  return (
    <div className="px-8 py-6">
      <h1 className='text-4xl font-bold'>Browse Levels</h1>
      <div className="flex gap-3 mt-4">
        {levels.map((level, levelIndex) => (
          <Level key={levelIndex} level={level} />
        ))}
      </div>
    </div>
  );
}

export default Levels