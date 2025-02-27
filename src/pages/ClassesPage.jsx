import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import Class from '../components/Class';
import { getClasses, getLevels } from '../api/class-wrapper';
import Button from '@/components/Button/Button';

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [level, setLevel] = useState();
  const [allLevels, setAllLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const levelNum = decodeURIComponent(params.id);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (params === "" || levelNum === "") {
      setLocation("/levels");
    }

    const classFilter = new URLSearchParams(`level=${levelNum}`);

    const fetchData = async () => {
      setLoading(true);
      const classData = await getClasses(classFilter);
      setClasses(classData);
      const levelData = await getLevels();
      setAllLevels(levelData);
      setLevel(levelData.find(l => l.level === parseInt(levelNum)));
      setLoading(false);
    };
    fetchData();
  }, [levelNum]);

  if (loading || !level) return;

  return (
    <div className="h-full flex-1 bg-white">
      {/* Banner Section */}
      <div className="header-gradient py-24 px-14">
        <h5 className="font-light text-dark-blue-700 mb-2">Level {level.level}</h5>
        <h3 className='font-extrabold text-dark-blue-800 mb-6'>{level.name}</h3>

        <p className="text-neutral-600 text-base sm:text-lg max-w-2xl mb-8">
          This class is for those with little to no experience in English. It will be going over
          the alphabet, basic vocabulary, and simple grammar rules.
        </p>

        <div className="flex gap-4">
          <span className="px-6 py-2.5 bg-white rounded-full text-neutral-500 text-sm">
            Basic Conversations
          </span>
          <span className="px-6 py-2.5 bg-white rounded-full text-neutral-500 text-sm">
            The Alphabet
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl px-14 py-24 space-y-24">
        {/* Open Classes */}
        <div>
          <h4 className="font-extrabold text-dark-blue-800 mb-4">Open Classes</h4>
          <p className="text-base sm:text-lg text-neutral-600 mb-8">
            Here are the open classes in this level. More information will be given by the instructor after you sign up!
          </p>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {classes.map((classObj, classIndex) => (
              <Class key={classIndex} classObj={classObj} />
            ))}
          </div>
        </div>
        {levelNum > 1 && <Button
          label={("Previous Level")}
          onClick={() => setLocation(`/levels/${Number(levelNum) - 1}/classes`)}
          isOutline={false}
        />}
        {levelNum < allLevels.length && <Button
          label={("Next Level")}
          onClick={() => setLocation(`/levels/${Number(levelNum) + 1}/classes`)}
          isOutline={false}
        />}
      </div>
    </div>
  );
};

export default ClassesPage;