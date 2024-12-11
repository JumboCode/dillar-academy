
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";

const HomeClass = ({ classObj }) => {
  const day1 = classObj.schedule[0].day.toString();
  const subDay1 = day1.substr(0, 3);

  const time = classObj.schedule[0].time.toString();

  const day2 = classObj.schedule[1].day.toString();
  const subDay2 = day2.substr(0, 3);


  return (
    <div className="p-4 bg-white rounded-md shadow-shadow overflow-hidden hover:shadow-shadow-hover transition-shadow w-60">
      <div className="flex flex-col gap-1.5">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold mb-1">{classObj.ageGroup}'s Class</h3>
          <p>  w/ {classObj.instructor} </p>
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

        <div className='gap-3 w-24'>
          <button
            className={`bg-gradient-to-r from-dark-blue-100 via-blue-100 to-turquoise-200 px-2 py-2 rounded-lg text-neutral-400 font-semibold transition-colors duration-300 w-full`}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeClass;