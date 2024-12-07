
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import Button from '@/components/Button/Button'

const Class = ({ classObj }) => {
  const ageGroup = classObj.ageGroup.toString();

  return (
    <div className="p-6 bg-white rounded-lg shadow-shadow overflow-hidden hover:shadow-shadow-hover transition-shadow">
      <div className="flex flex-col gap-4">
        {/* Header */}

        <div>
            <h3>You are registered!</h3>
            <p>
            {ageGroup.charAt(0).toUpperCase() + ageGroup.slice(1)}'s Class w/ {classObj.instructor}
            </p>
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
          <Button
            label={"Got it"}
            onClick={() => alert("dummy button clicked!")}
            isOutline={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Class;