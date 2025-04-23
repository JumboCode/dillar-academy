import { useState, useEffect } from 'react';
import { useLocation, useParams, Link } from 'wouter';
import Class from '../components/Class/Class';
import Level from '@/components/Class/Level';
import { getClasses, getLevels } from '../api/class-wrapper';
import { useTranslation } from "react-i18next";

const ClassesPage = () => {
  const { t, i18n } = useTranslation();
  const [classes, setClasses] = useState([]);
  const [level, setLevel] = useState();
  const [allLevels, setAllLevels] = useState([]);
  const [allowRender, setAllowRender] = useState(false);
  const params = useParams();
  const levelNum = decodeURIComponent(params.id);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (params === "" || levelNum === "") {
      setLocation("/levels");
    }

    const classFilter = new URLSearchParams(`level=${levelNum}`);

    const fetchData = async () => {
      const classData = await getClasses(classFilter);
      setClasses(classData);
      const levelData = await getLevels();
      setAllLevels(levelData);
      setLevel(levelData.find(l => l.level === parseInt(levelNum)));
      setAllowRender(true);
    };
    fetchData();
  }, [levelNum]);

  function localizeNumber(number, lang) {
    let locale = lang;

    // Use Han characters for Chinese
    if (lang.startsWith('zh')) {
      locale = 'zh-CN-u-nu-hanidec';
    }

    return new Intl.NumberFormat(locale).format(number);
  }

  const toTitleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  if (!level || allLevels.length === 0) return <div>Loading classes...</div>;

  const currentLevelIndex = allLevels.findIndex(l => l.level === level.level);

  return (
    <div className="w-full h-full flex-1 bg-white flex flex-col items-center">
      {/* Banner Section */}
      <div className="header-gradient w-full flex flex-col items-center">
        <div className="w-full max-w-[96rem] py-20 lg:py-24 px-4 sm:px-6 lg:px-20">
          <h3 className="font-light text-dark-blue-700 mb-2">{t('level_num', { num: localizeNumber(level.level, i18n.language), ns: "levels" })}</h3>
          <h1 className='font-extrabold text-dark-blue-800 mb-6'>{t(`level_name_${level._id}`, { ns: "levels" })}</h1>
          <p className="text-neutral-600 text-base sm:text-lg max-w-2xl mb-8">
            {t(`level_desc_${level._id}`, { ns: "levels" })}
          </p>
          <div className="flex gap-4">
            {level.skills.map((skill, index) => (
              <span key={index} className="px-6 py-2.5 bg-white rounded-full text-neutral-500 text-sm">
                <p>{toTitleCase(t(`level_skill_${skill.toLowerCase().replace(/ /g, "_")}_${level._id}`, { ns: "levels" }))}</p>
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
            {classes.length > 0 ? (
              classes.map((classObj, classIndex) => (
                <Class key={classIndex} classObj={classObj} />
              ))
            ) : (
              <p className="text-gray-500">No classes available</p>
            )}
          </div>
          <div className='grid grid-cols-2 w-full gap-x-6'>
            {currentLevelIndex > 0 && (
              <Link href={`/levels/${allLevels[currentLevelIndex - 1].level}/classes`} className="col-start-1">
                <Level
                  level={allLevels[currentLevelIndex - 1]}
                  numLevels={allLevels.length}
                  isSimplified
                />
              </Link>
            )}
            {currentLevelIndex < allLevels.length - 1 && (
              <Link href={`/levels/${allLevels[currentLevelIndex + 1].level}/classes`} className="col-start-2">
                <Level
                  level={allLevels[currentLevelIndex + 1]}
                  numLevels={allLevels.length}
                  isArrowRight
                  isSimplified
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassesPage;