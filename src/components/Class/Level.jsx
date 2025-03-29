import { IoChevronForward } from "react-icons/io5";

const Level = ({ level, isSimplified, isShadowRight, numLevels }) => {
  console.log(level)
  // TODO: modify to account for num levels changing
  const levelColorMapping = {
    1: "shadow-[inset_0.5em_0_theme(colors.turquoise.200)]",
    2: "shadow-[inset_0.5em_0_theme(colors.turquoise.300)]",
    3: "shadow-[inset_0.5em_0_theme(colors.turquoise.500)]",
    4: "shadow-[inset_0.5em_0_theme(colors.turquoise.700)]",
    5: "shadow-[inset_0.5em_0_theme(colors.turquoise.800)]",
  }
  const isString = typeof level.level === "string";

  return isSimplified ? (
    <div className="h-full shadow-shadow hover:shadow-shadow-hover transition-shadow rounded-2xl">
      <div className={`h-full py-8 px-7 flex items-center justify-between bg-white ${levelColorMapping.hasOwnProperty(level.level) ? levelColorMapping[level.level] : "shadow-[inset_0.5em_0_#594BD2]"} rounded-2xl overflow-hidden transition-shadow`}>
        <div className="flex flex-col sm:flex-row sm:gap-x-12 sm:items-center">
          <h5 className="font-extrabold text-dark-blue-800">{isString ? "" : "Level "}{level.level}</h5>
          <p className="text-neutral-600">{level.name}</p>
        </div>
        <IoChevronForward className="text-2xl text-[#2F2F32]" />
      </div>
    </div>
  ) : (
    <div className="w-full h-full rounded-2xl shadow-shadow hover:shadow-shadow-hover transition-shadow grid grid-rows-2">
      <div className="bg-[url('/images/blue_mountains.png')] bg-no-repeat bg-cover bg-center rounded-t-2xl"></div>
      <div className="bg-white px-6 py-8 row-start-2 rounded-b-2xl space-y-1">
        <h5 className='font-extrabold'>Level {level.level}</h5>
        <p className="text-base sm:text-lg">{level.name}</p>
      </div>
    </div>
  )
}

export default Level