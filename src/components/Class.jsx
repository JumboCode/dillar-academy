
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import EnrollButton from '@/components/Button/EnrollButton'

const Class = ({ classObj }) => {
  const ageGroup = classObj.ageGroup.toString();

  return (
    <div className="p-6 bg-white rounded-lg border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-extrabold text-dark-blue-800 mb-1">
            {ageGroup.charAt(0).toUpperCase() + ageGroup.slice(1)}'s Class
          </h3>
          <span className="text-sm text-neutral-400">w/ {classObj.instructor}</span>
        </div>

        {/* Schedule */}
        <div className="space-y-3">
          {classObj.schedule.map((schedule, index) => (
            <div key={index} className="flex items-center text-neutral-400 text-sm">
              <div className="flex items-center gap-2 w-1/2">
                <IoCalendarOutline className="text-lg" />
                <span>{schedule.day}</span>
              </div>
              <div className="flex items-center gap-2">
                <IoTimeOutline className="text-lg" />
                <span>{schedule.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className='grid grid-cols-2 gap-3'>
          <EnrollButton
            userId={null}
            classId={classObj._id}
            isEnroll={true}
          />
          <EnrollButton
            userId={null}
            classId={classObj._id}
            isEnroll={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Class;