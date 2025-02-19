
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import Button from '@/components/Button/Button'

const Class = ({ classObj }) => {
  const ageGroup = classObj.ageGroup.toString();
  const day1 = classObj.schedule[0].day.toString();
  const subDay1 = day1.substr(0, 3);

  const time = classObj.schedule[0].time.toString();

  const day2 = classObj.schedule[1].day.toString();
  const subDay2 = day2.substr(0, 3);


  return (
    <div className="p-6 bg-white rounded-lg shadow-shadow overflow-hidden hover:shadow-shadow-hover transition-shadow w-96">
      <div className="flex flex-col gap-2">
        {/* Header */}

        <div>
          <h5 className="font-extrabold mb-2">You are registered!</h5>
          <p>
            {ageGroup.charAt(0).toUpperCase() + ageGroup.slice(1)}'s Class w/ {classObj.instructor}
          </p>
        </div>

        {/* Schedule */}
        <div className="flex flex-col text-neutral-400 text-sm mb-2">
          <div className="flex items-left gap-2">
            <IoCalendarOutline className="text-lg" />
            <span>{subDay1} & {subDay2}</span>
          </div>
          <div className="flex items-left gap-2">
            <IoTimeOutline className="text-lg" />
            <span>{time}</span>
          </div>
        </div>

        <div className='gap-3 w-full'>
          <button
            className={`px-4 py-2 rounded-lg transition-colors duration-300 border border-dark-blue-800 w-full`}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Class;