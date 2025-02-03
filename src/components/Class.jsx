
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import EnrollButton from '@/components/Button/EnrollButton'
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { SignedIn } from '@clerk/clerk-react';

const Class = ({ classObj }) => {
  const ageGroup = classObj.ageGroup.toString();
  const { user, } = useContext(UserContext);

  return (
    <div className="p-6 bg-white rounded-lg shadow-shadow overflow-hidden hover:shadow-shadow-hover transition-shadow">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-extrabold text-dark-blue-800 mb-1">
            {ageGroup === "all" ? 'All Ages' : `${ageGroup.charAt(0).toUpperCase() + ageGroup.slice(1)}'s Class`}
          </h3>
          <span className="text-sm text-neutral-400">w/ {classObj.instructor}</span>
        </div>
        {/* Schedule */}
        <div className="grid grid-rows-2 grid-cols-[min-content] items-center gap-x-2 gap-y-1">
          <IoTimeOutline className="text-xl row-start-1" />
          <IoCalendarOutline className="text-xl row-start-2" />
          {classObj.schedule.map((schedule, index) => (
            <>
              {index === 1 && <div className="row-span-full w-0 h-full border-[1px]"></div>}
              <p className="row-start-1">{schedule.time}</p>
              <p className="row-start-2">{schedule.day}</p>
            </>
          ))}
        </div>
        <SignedIn>
          <div className='grid grid-cols-2 gap-3'>
            <EnrollButton
              userId={user?._id}
              classId={classObj._id}
              isEnroll={true}
            />
            {/* <EnrollButton
              userId={user?._id}
              classId={classObj._id}
              isEnroll={false}
            /> */}
          </div>
        </SignedIn>
      </div>
    </div>
  );
};

export default Class;