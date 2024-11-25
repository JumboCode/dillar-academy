
const Level = ({ level, isSimplified }) => {
  const levelColorMapping = {
    1: "shadow-[inset_0.5em_0_theme(colors.turquoise.200)]",
    2: "shadow-[inset_0.5em_0_theme(colors.turquoise.300)]",
    3: "shadow-[inset_0.5em_0_theme(colors.turquoise.500)]",
    4: "shadow-[inset_0.5em_0_theme(colors.turquoise.700)]",
    5: "shadow-[inset_0.5em_0_theme(colors.turquoise.800)]"
  }

  return isSimplified ? (
    <div className={`py-6 pl-7 bg-white ${levelColorMapping[level.level]} rounded-2xl border border-neutral-100 overflow-hidden hover:drop-shadow-md transition-shadow`}>
      <h3 className="text-xl font-extrabold text-dark-blue-800 mb-1">Level {level.level}</h3>
      <p className="text-neutral-600 text-sm mb-2">{level.description || "New Concept Book 1 -- Ch. 1-72"}</p>
      <p className="text-blue-500 text-sm font-medium">
        View Level →
      </p>
    </div>
  ) : (
    <div className="w-full h-full rounded-2xl shadow-lg grid grid-rows-[2fr_3fr]">
      <div className="bg-[url('/images/blue_mountains.png')] bg-no-repeat bg-cover bg-center rounded-t-2xl"></div>
      <div className="bg-white px-6 py-5 row-start-2 rounded-b-2xl">
        <h4 className='text-2xl font-semibold'>Level: {level.level}</h4>
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