import { useState, useEffect } from 'react';
import { useSearch, useLocation, Link } from 'wouter';
import Class from '../components/Class';
import Level from '../components/Level';
import { getClasses, getLevels } from '../api/class-wrapper';

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [level, setLevel] = useState();
  const [allLevels, setAllLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const queryString = useSearch();
  const [, setLocation] = useLocation();
  console.log(queryString.toString())

  useEffect(() => {
    if (queryString === "" || queryString.split("=")[1] === "") {
      setLocation("/levels");
    }

    const classFilter = new URLSearchParams(queryString);

    const fetchData = async () => {
      setLoading(true);
      const classData = await getClasses(classFilter.toString());
      setClasses(classData);
      const levelData = await getLevels();
      setAllLevels(levelData);
      setLevel(levelData.find(l => l.level === parseInt(classFilter.get("level"))));
      setLoading(false);
    };
    fetchData();
  }, [queryString]);

  if (loading || !level) return <></>;

  return (
    <div className="min-h-screen bg-white">
      {/* Banner Section */}
      <div className="bg-gradient-to-r from-[#FFFFFF] from-5% via-[#D3EDFC] via-35% via-[#B2A0FA] via-75% via-[#8AC7F4] to-[#3F96EA] py-12">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-lg text-dark-blue-700 mb-2">Level {level.level}</p>
          <h1 className='text-4xl font-bold text-dark-blue-800 mb-4'>{level.name}</h1>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-300 to-blue-400 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 border-2 border-white"></div>
            </div>
            <p className="text-neutral-400">{level.enrolledCount || 46} students enrolled</p>
          </div>

          <p className="text-neutral-600 max-w-2xl mb-8">
            This class is for those with little to no experience in English. It will be going over
            the alphabet, basic vocabulary, and simple grammar rules.
          </p>

          <div className="flex gap-4">
            <span className="px-6 py-2.5 bg-white rounded-full text-neutral-500 text-sm hover:bg-opacity-90 transition-colors">
              Basic Conversations
            </span>
            <span className="px-6 py-2.5 bg-white rounded-full text-neutral-500 text-sm hover:bg-opacity-90 transition-colors">
              The Alphabet
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Open Classes */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-dark-blue-800 mb-4">Open Classes</h2>
          <p className="text-neutral-600 mb-8">
            Here are the open classes in this level. More information will be given by the instructor after you sign up!
          </p>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            {classes.map((classObj, classIndex) => (
              <Class key={classIndex} classObj={classObj} />
            ))}
          </div>
        </div>

        {/* Other Levels */}
        <div>
          <h2 className="text-2xl font-bold text-dark-blue-800 mb-4">Other Levels</h2>
          <p className="text-neutral-600 mb-8">
            If this level isn't a good fit for you, take a look at the other available levels!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allLevels
              .filter(l => l.level !== level.level)
              .map((level, index) => {
                const classFilter = new URLSearchParams({ level: level.level });
                return (
                  <Link key={index} href={`/classes?${classFilter.toString()}`}>
                    <Level level={level} isSimplified={true} />
                  </Link>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassesPage;