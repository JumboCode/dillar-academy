import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";

const Level = ({ level, isSimplified, direction }) => {
  const prevLevelColorMapping = {
    1: "shadow-[inset_0.5em_0_theme(colors.turquoise.200)]",
    2: "shadow-[inset_0.5em_0_theme(colors.turquoise.300)]",
    3: "shadow-[inset_0.5em_0_theme(colors.turquoise.500)]",
    4: "shadow-[inset_0.5em_0_theme(colors.turquoise.700)]",
    5: "shadow-[inset_0.5em_0_theme(colors.turquoise.800)]"
  }

  const nextLevelColorMapping = {
    1: "shadow-[inset_-0.5em_0_theme(colors.turquoise.200)]",
    2: "shadow-[inset_-0.5em_0_theme(colors.turquoise.300)]",
    3: "shadow-[inset_-0.5em_0_theme(colors.turquoise.500)]",
    4: "shadow-[inset_-0.5em_0_theme(colors.turquoise.700)]",
    5: "shadow-[inset_-0.5em_0_theme(colors.turquoise.800)]"
  }

  return isSimplified ? (
    direction == "prev" ? (
    <div className="shadow-shadow flex flex-col hover:shadow-shadow-hover transition-shadow rounded-2xl">
      <div className={`py-6 pl-7 bg-white ${prevLevelColorMapping[level.level]} rounded-2xl overflow-hidden transition-shadow`}>
        <div className="flex items-center justify-between">
          <SlArrowLeft style={{ fontSize: '20px' }} vcolor="grey" className="mr-4"/>
          <h3 className="text-xl font-extrabold text-dark-blue-800">Level {level.level}</h3>
          <p className="text-gray-400 text-sm flex-1 text-right mr-4 truncate">{level.description || "New Concept Book 1 -- Ch. 1-72"}</p>
        </div>
      </div>
    </div>
    ) : (
      <div className="shadow-shadow flex flex-col hover:shadow-shadow-hover transition-shadow rounded-2xl">
      <div className={`py-6 pl-7 bg-white ${nextLevelColorMapping[level.level]} rounded-2xl overflow-hidden transition-shadow`}>
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm flex-1 text-left truncate">{level.description || "New Concept Book 1 -- Ch. 1-72"}</p>
          <h3 className="text-xl font-extrabold text-dark-blue-800">Level {level.level}</h3>
          <SlArrowRight style={{ fontSize: '20px' }} vcolor="grey" className="ml-4 mr-4"/>
        </div>
      </div>
    </div>
    )

  ) : (
    <div className="w-full h-full rounded-2xl shadow-shadow hover:shadow-shadow-hover transition-shadow grid grid-rows-[2fr_3fr]">
      <div className="bg-[url('/images/blue_mountains.png')] bg-no-repeat bg-cover bg-center rounded-t-2xl"></div>
      <div className="bg-white px-6 py-5 row-start-2 rounded-b-2xl">
        <h4 className='text-2xl font-extrabold'>Level: {level.level}</h4>
        <p className="">{level.name}</p>
        <div>
          <p>Instructors:</p>
          {level.instructors.map((instructor, instructorIndex) => (
            <p key={instructorIndex}>{instructor}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Level