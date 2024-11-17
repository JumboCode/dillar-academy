
const ConversationClass = ({ conversation }) => {
  return (
    <div className="w-full h-full rounded-2xl shadow-lg grid grid-rows-[2fr_3fr]">
      <div className="bg-[url('/images/blue_mountains.png')] bg-no-repeat bg-cover bg-center rounded-t-2xl"></div>
      <div className="bg-white px-6 py-5 row-start-2 rounded-b-2xl">
        <h3 className='text-2xl font-semibold'>Talk to {conversation.instructor}</h3>
        <p>{conversation.ageGroup.charAt(0).toUpperCase() + conversation.ageGroup.slice(1)} ages</p>
        {conversation.schedule.map((schedule, index) => (
          <p key={index} className="text-black opacity-50">{schedule.day} {schedule.time}</p>
        ))}
      </div>
    </div>
  )
}

export default ConversationClass;