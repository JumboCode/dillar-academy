
// possible modes: edit or none
const ConversationClass = ({ conversation, modes = [], editURL = "" }) => {
  return (
    <div className="w-full h-full rounded-2xl shadow-shadow hover:shadow-shadow-hover transition-shadow grid grid-rows-[2fr_3fr]">
      <div className="bg-[url('/images/blue_mountains.png')] bg-no-repeat bg-cover bg-center rounded-t-2xl"></div>
      <div className="bg-white px-6 py-5 row-start-2 rounded-b-2xl space-y-1">
        <h5 className='font-extrabold'>Talk to {conversation.instructor}</h5>
        <p className="text-sm">{conversation.ageGroup === "all" ? "All Ages" : "For " + conversation.ageGroup.charAt(0).toUpperCase() + conversation.ageGroup.slice(1)}</p>
        {conversation.schedule.map((schedule, index) => (
          <p key={index} className="text-black opacity-50">{schedule.day} {schedule.time}</p>
        ))}
      </div>
      <div className='flex gap-3'>
        {modes.includes("edit") && <EditButton classId={conversation._id} editURL={editURL} />}
      </div>
    </div>
  )
}

export default ConversationClass;