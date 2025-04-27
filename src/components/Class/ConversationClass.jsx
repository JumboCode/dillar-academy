import EditButton from '@/components/Button/EditButton';
import { useTranslation } from "react-i18next";

// possible modes: edit or none
const ConversationClass = ({ conversation, modes = [], editURL = "" }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-shadow hover:shadow-shadow-hover transition-shadow grid grid-rows-[2fr_3fr]">
      <div className="bg-[url('/images/blue_mountains.png')] bg-no-repeat bg-cover bg-center rounded-t-2xl"></div>
      <div className="bg-white px-6 py-5 row-start-2 space-y-1">
        <h3 className='font-extrabold'>{t('talk_to_name', { name: conversation.instructor })}</h3>
        <p className="text-sm">{t(`for_${conversation.ageGroup}`)}</p>
        {conversation.schedule.map((schedule, index) => (
          <p key={index} className="text-black opacity-50 w-fit">{t(`${schedule.day.toLowerCase()}`)} {schedule.startTime}</p>
        ))}
      </div>
      <div className='flex gap-3 mb-4 ml-5'>
        {modes.includes("edit") && <EditButton classId={conversation._id} editURL={editURL} />}
      </div>
    </div>
  )
}

export default ConversationClass;