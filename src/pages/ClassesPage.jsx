import { useState, useEffect } from 'react';
import { useLocation, useParams, Link } from 'wouter';
import Class from '../components/Class/Class';
import Level from '@/components/Class/Level';
import { getClasses, getLevels } from '../api/class-wrapper';
import { useTranslation } from "react-i18next";

const ClassesPage = () => {
  const { t } = useTranslation();
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
    <div className="w-full h-full flex-1 bg-white flex flex-col items-center">
      {/* Banner Section */}
      <div className="header-gradient w-full flex flex-col items-center">
        <div className="w-full max-w-[96rem] py-20 lg:py-24 px-4 sm:px-6 lg:px-20">
          <h3 className="font-light text-dark-blue-700 mb-2">{t(`level_${level.level}`)}</h3>
          <h1 className='font-extrabold text-dark-blue-800 mb-6'>{level.name}</h1>
          <p className="text-neutral-600 text-base sm:text-lg max-w-2xl mb-8">
            {level.description}
          </p>
          <div className="flex gap-4">
            {level.skills.map((skill, index) => (
              <span key={index} className="px-6 py-2.5 bg-white rounded-full text-neutral-500 text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full flex flex-col items-center">
        {/* Open Classes */}
        <div className='w-full max-w-[96rem] px-4 sm:px-6 lg:px-20 py-12 lg:py-24'>
          <h2 className="font-extrabold text-dark-blue-800 mb-4">{t("classespage_open_classes")}</h2>
          <p className="text-base sm:text-lg text-neutral-600 mb-8">
            {t("classespage_open_classes_desc")}
          </p>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-24'>
            {classes.map((classObj, classIndex) => (
              <Class key={classIndex} classObj={classObj} />
            ))}
          </div>
          <div className='grid grid-cols-2 w-full gap-x-6'>
            {levelNum > 1 && <Link href={`/levels/${Number(levelNum) - 1}/classes`} className={"col-start-1"}>
              <Level
                level={allLevels.find(l => l.level === parseInt(levelNum) - 1)}
                numLevels={allLevels.length}
                isSimplified />
            </Link>}
            {levelNum < allLevels.length && <Link href={`/levels/${Number(levelNum) + 1}/classes`} className={"col-start-2"}>
              <Level
                level={allLevels.find(l => l.level === parseInt(levelNum) + 1)}
                numLevels={allLevels.length}
                isArrowRight
                isSimplified />
            </Link>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassesPage;