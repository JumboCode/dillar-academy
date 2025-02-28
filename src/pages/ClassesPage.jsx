import { useState, useEffect } from "react";
import { useLocation, Link, useParams } from "wouter";
import Class from "../components/Class";
import Level from "../components/Level";
import { getClasses, getLevels } from "../api/class-wrapper";
import Button from "@/components/Button/Button";

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [level, setLevel] = useState(null);
  const [allLevels, setAllLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const levelNum = Number(decodeURIComponent(params.id)); // Ensure it's a number
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!params.id) {
      setLocation("/levels");
    }

    const classFilter = new URLSearchParams(`level=${levelNum}`);

    const fetchData = async () => {
      setLoading(true);
      const classData = await getClasses(classFilter.toString());
      setClasses(classData);
      const levelData = await getLevels();
      setAllLevels(levelData);

      // Find the current level in the levels array
      const currentLevel = levelData.find((l) => l.level === levelNum);
      setLevel(currentLevel);
      setLoading(false);
    };
    fetchData();
  }, [levelNum]);

  if (loading || !level) return <div>Loading...</div>;

  // Find the previous and next levels
  const levelIndex = allLevels.findIndex((l) => l.level === levelNum);

  // Ensure index is valid
  if (levelIndex === -1) {
    return <div>Error: Level not found</div>;
  }

  const prevLevel = levelIndex > 0 ? allLevels[levelIndex - 1] : null;
  const nextLevel = levelIndex < allLevels.length - 1 ? allLevels[levelIndex + 1] : null;

  return (
    <div className="h-full bg-white">
      {/* Banner Section */}
      <div className="header-gradient py-28 px-14">
        <p className="text-2xl text-dark-blue-700 mb-2">Level {level.level}</p>
        <h1 className="text-4xl font-extrabold text-dark-blue-800 mb-6">{level.name}</h1>

        <p className="text-neutral-600 text-lg max-w-2xl mb-8">
          This class is for those with little to no experience in English. It will be going over the
          alphabet, basic vocabulary, and simple grammar rules.
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
      <div className="max-w-7xl px-14 py-12">
        {/* Open Classes */}
        <div className="mb-20">
          <h2 className="text-2xl font-extrabold text-dark-blue-800 mb-4">Open Classes</h2>
          <p className="text-neutral-600 mb-8">
            Here are the open classes in this level. More information will be given by the instructor after you sign up!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classes.map((classObj, classIndex) => (
              <Class key={classIndex} classObj={classObj} />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {/* <div className="flex justify-between px-14 py-8">
        {prevLevel && (
          <Button
            label="Previous Level"
            onClick={() => setLocation(`/levels/${prevLevel.level}/classes`)}
            isOutline={false}
          />
        )}
        {nextLevel && (
          <Button
            label="Next Level"
            onClick={() => setLocation(`/levels/${nextLevel.level}/classes`)}
            isOutline={false}
          />
        )}
      </div> */}

      {/* Previous and Next Levels Display */}
      <div className="grid grid-cols-2 w-full mb-[45px] gap-6 px-4">
        {prevLevel && (
          <Link key={`prev-${prevLevel.level}`} href={`/levels/${prevLevel.level}/classes`}>
            <Level level={prevLevel} direction={"prev"} isSimplified={true} />
          </Link>
        )}
        {nextLevel && (
          <Link key={`next-${nextLevel.level}`} href={`/levels/${nextLevel.level}/classes`}>
            <Level level={nextLevel} direction={"next"} isSimplified={true} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default ClassesPage;
