
const Level = ({ level }) => {
  return (
    <div className="w-full h-full rounded-2xl shadow-shadow hover:shadow-shadow-hover transition-shadow grid grid-rows-2">
      <div
        style={{ backgroundImage: `url('/images/${level.image}')` }}
        className={`bg-no-repeat bg-cover bg-center rounded-t-2xl`}></div>
      <div className="bg-white px-6 py-8 row-start-2 rounded-b-2xl space-y-1">
        <h3 className='font-extrabold'>Level {level.level}</h3>
        <p className="text-base sm:text-lg">{level.name}</p>
      </div>
    </div>
  )
}

export default Level