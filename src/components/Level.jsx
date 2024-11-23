
const Level = ({ level, isSimplified }) => {
  return isSimplified ? (
    // TODO (Fahim & Tony): work on the simplified version of the Level component seen on the Class pages
    <div></div>
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