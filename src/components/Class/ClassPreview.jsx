import React, { useEffect, useRef, useState } from 'react';
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import Button from '@/components/Button/Button';
import { convertTime, to12HourFormat } from '@/utils/time-utils';

const Class = ({ classObj }) => {
  const [showScrollHint, setShowScrollHint] = useState(false);
  const scheduleRef = useRef(null);

  useEffect(() => {
    const ele = scheduleRef.current;
    if (!ele) return;

    const checkOverflow = () => {
      setShowScrollHint(ele.scrollWidth > ele.clientWidth);
    };

    checkOverflow();

    // Optionally re-check on window resize
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-shadow overflow-hidden hover:shadow-shadow-hover transition-shadow">
      {/* Header */}
      <div className='mb-4'>
        <h3 className="font-extrabold text-dark-blue-800 mb-1">
          {classObj.ageGroup === "all" ? 'All Ages' : `${classObj.ageGroup.charAt(0).toUpperCase() + classObj.ageGroup.slice(1)}'s Class`}
        </h3>
        <p className="text-sm text-neutral-400">
          with {classObj.instructor}
        </p>
      </div>

      {/* Schedule */}
      <div ref={scheduleRef} className="grid grid-rows-[auto_auto] auto-cols-min max-w-full overflow-scroll items-center gap-x-4 gap-y-3 mb-1 pb-4">
        <IoTimeOutline className="text-xl row-start-1" />
        <IoCalendarOutline className="text-xl row-start-2" />

        {classObj.schedule.map((schedule, index) => {
          const convertedStartTimeEST = schedule?.startTime
            ? convertTime(schedule.day, schedule.startTime, "Etc/UTC", "America/New_York")
            : { time: '', day: '' };
          const convertedEndTimeEST = schedule?.endTime
            ? convertTime(schedule.day, schedule.endTime, "Etc/UTC", "America/New_York")
            : { time: '', day: '' };
          const convertedStartTimeIST = schedule?.startTime
            ? convertTime(schedule.day, schedule.startTime, "Etc/UTC", "Europe/Istanbul")
            : { time: '', day: '' };
          const convertedEndTimeIST = schedule?.endTime
            ? convertTime(schedule.day, schedule.endTime, "Etc/UTC", "Europe/Istanbul")
            : { time: '', day: '' };

          return (
            <React.Fragment key={index}>
              <div className='row-start-1 w-max'>
                {/* EST Time */}
                <p className='w-full'>
                  {to12HourFormat(convertedStartTimeEST.time)}-{to12HourFormat(convertedEndTimeEST.time)} (EST)
                </p>
                {/* Istanbul Times */}
                <p className='w-full'>
                  {convertedStartTimeIST.time}-{convertedEndTimeIST.time} (Istanbul)
                </p>
              </div>
              <p className="row-start-2 w-max">
                {convertedStartTimeEST.day} (EST) | {convertedStartTimeIST.day} (Istanbul)
              </p>

              {/* Divider */}
              {index !== classObj.schedule.length - 1 && <div className="row-span-full h-full border-[1px]"></div>}
            </React.Fragment>
          )
        })}
      </div>
      {showScrollHint && (
        <p className="text-xs italic text-neutral-400 mb-4">Scroll to see more times →</p>
      )}

      <Button label="Enroll" />
    </div>
  );
};

export default Class;
