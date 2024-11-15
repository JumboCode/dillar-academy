import { Link } from "wouter"

const Level = ({ level }) => {
  const params = new URLSearchParams()
  params.set("level", level.level)

  return (
    <Link href={`/classes?${params.toString()}`} className="bg-white px-4 py-3 rounded-lg w-1/4 h-1/4 shadow-md">
      <h3 className='text-2xl font-semibold'>Level: {level.level}</h3>
      <p>{level.name}</p>
      <div>
        <p>Instructors:</p>
        {level.instructors.map((instructor, instructorIndex) => (
          <p key={instructorIndex}>{instructor}</p>
        ))}
      </div>
    </Link>
  )
}

export default Level