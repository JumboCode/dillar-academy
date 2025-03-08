
const Level = ({ level, isSimplified }) => {
  const levelColorMapping = {
    1: "shadow-[inset_0.5em_0_theme(colors.turquoise.200)]",
    2: "shadow-[inset_0.5em_0_theme(colors.turquoise.300)]",
    3: "shadow-[inset_0.5em_0_theme(colors.turquoise.500)]",
    4: "shadow-[inset_0.5em_0_theme(colors.turquoise.700)]",
    5: "shadow-[inset_0.5em_0_theme(colors.turquoise.800)]",
    "conversation": "shadow-[inset_0.5em_0_#594BD2]",
  }

  return isSimplified ? (
    <div className="shadow-shadow hover:shadow-shadow-hover transition-shadow rounded-2xl">
      <div className={`py-6 pl-7 bg-white ${levelColorMapping[level.level]} rounded-2xl overflow-hidden transition-shadow`}>
        <h3 className="text-xl font-extrabold text-dark-blue-800 mb-1">Level {level.level}</h3>
        <p className="text-neutral-600 text-sm mb-2">{level.name}</p>
        <p className="text-blue-500 text-sm font-medium">
          View Level →
        </p>
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