import { Link } from "wouter"

const Level = ({ level, isSimplified }) => {
  const params = new URLSearchParams()
  params.set("level", level.level)

  if (isSimplified) {
    return (
      <div className="bg-white shadow-level rounded-lg border border-neutral-100 overflow-hidden hover:drop-shadow-md transition-shadow">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-dark-blue-800 mb-2">Level {level.level}</h3>
                    <p className="text-neutral-600 text-sm mb-4">{level.description || "New Concept Book 1 -- Ch. 1-72"}</p>
                    <button 
                      onClick={() => setLocation(`/classes?level=${level.level}`)}
                      className="text-blue-500 text-sm font-medium hover:text-blue-600"
                    >
                      View Level →
                    </button>
                  </div>
        </div>
    )
  }

  return (
    <Link 
      href={`/classes?${params.toString()}`} 
      className="bg-white px-6 py-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div>
        <h3 className='text-2xl font-semibold text-dark-blue-800 mb-2'>
          Level {level.level}
        </h3>
        <p className="text-neutral-600 mb-4">{level.name}</p>
        <div>
          <p className="text-sm text-neutral-500 mb-2">Instructors:</p>
          {level.instructors.map((instructor, instructorIndex) => (
            <p 
              key={instructorIndex}
              className="text-sm text-neutral-600"
            >
              {instructor}
            </p>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default Level