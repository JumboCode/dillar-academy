import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams, Link } from 'wouter';
import Class from '../components/Class/Class';
import Level from '@/components/Class/Level';
import SkeletonClass from '@/components/Skeletons/SkeletonClass';
import { getClasses, getLevels } from '../api/class-wrapper';
import { useTranslation } from "react-i18next";
import SkeletonLevel from '../components/Skeletons/SkeletonLevel';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useDelayedSkeleton from '@/hooks/useDelayedSkeleton';

const ClassesPage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useContext(UserContext);
  const [classes, setClasses] = useState([]);
  const [level, setLevel] = useState();
  const [allLevels, setAllLevels] = useState([]);
  const [allowRender, setAllowRender] = useState(false);
  const params = useParams();
  const levelNum = decodeURIComponent(params.id);
  const [, setLocation] = useLocation();
  const showSkeleton = useDelayedSkeleton(!allowRender);

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
  }, [levelNum, user]);

  function localizeNumber(number, lang) {
    let locale = lang;

    // Use Han characters for Chinese
    if (lang.startsWith('zh')) {
      locale = 'zh-CN-u-nu-hanidec';
    }

    return new Intl.NumberFormat(locale).format(number);
  }

  const toTitleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  const currentLevelIndex = allLevels.findIndex(l => l.level === level.level);

  return (
    <div className="w-full h-full flex-1 bg-white flex flex-col items-center">
      {/* Banner Section */}
      <div className="header-gradient w-full flex flex-col items-center">
        <div className="w-full max-w-[96rem] py-20 lg:py-24 px-4 sm:px-6 lg:px-20">
          <h3 className="font-light text-dark-blue-700 mb-2">
            {allowRender ? t('level_num', { num: localizeNumber(level.level, i18n.language), ns: "levels" }) : showSkeleton && <Skeleton width={"10rem"} />}
          </h3>
          <h1 className='font-extrabold text-dark-blue-800 mb-6'>
            {allowRender ? t(`level_name_${level._id}`, { ns: "levels" }) : showSkeleton && <Skeleton width={"24rem"} />}
          </h1>
          <p className="text-neutral-600 text-base sm:text-lg max-w-2xl mb-8">
            {allowRender ? t(`level_desc_${level._id}`, { ns: "levels" }) : showSkeleton && <Skeleton />}
          </p>
          <div className="flex gap-4">
            {allowRender
              ? level.skills.map((skill, i) => (
                <span key={i} className="px-6 py-2.5 bg-white rounded-full text-neutral-500 text-sm">
                  <p>
                    {toTitleCase(t(`level_skill_${skill.toLowerCase().replace(/ /g, "_")}_${level._id}`, { ns: "levels" }))}
                  </p>
                </span>
              ))
              : showSkeleton && Array(3).fill(0).map((_, i) => (
                <span key={i} className="px-6 py-2.5 bg-white rounded-full text-neutral-500 text-sm">
                  <Skeleton width={"3rem"} />
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full flex flex-col items-center">
        {/* Open Classes */}
        <div className='w-full max-w-[96rem] px-4 sm:px-6 lg:px-20 py-12 lg:py-24'>
          <h2 className="font-extrabold text-dark-blue-800 mb-4">
            {allowRender ? t("classespage_open_classes") : showSkeleton && <Skeleton width={"16rem"} />}
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 mb-8">
            {allowRender ? t("classespage_open_classes_desc") : showSkeleton && <Skeleton />}
          </p>
          <div className='grid grid-cols-1 lg:grid-cols-3 auto-rows-fr gap-6 mb-24'>
            {allowRender
              ? classes.length > 0 ? (
                classes.map((classObj, classIndex) => (
                  <Class key={classIndex} classObj={classObj} />
                ))
              ) : (
                <p className="text-gray-500">{t("no_classes_available")}</p>
              )
              : showSkeleton && <SkeletonClass count={3} />}
          </div>
          {allowRender
            ? <div className='grid grid-cols-2 w-full gap-x-6'>
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
            : showSkeleton && (
              <div className='grid grid-cols-2 w-full gap-x-6'>
                <SkeletonLevel isSimplified />
                <SkeletonLevel isSimplified isArrowRight />
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ClassesPage;