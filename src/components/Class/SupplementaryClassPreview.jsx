import React, { useEffect, useRef, useState } from 'react';
import Button from '@/components/Button/Button';
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import { convertTime, to12HourFormat } from '@/utils/time-utils';

// possible modes: enroll, unenroll, or edit
const SupplementaryClass = ({ cls }) => {
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
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-shadow hover:shadow-shadow-hover transition-shadow grid grid-rows-[2fr_3fr]">
      <div
        style={{ backgroundImage: `url('/images/${cls.image}')` }}
        className="bg-no-repeat bg-cover bg-center rounded-t-2xl"></div>
      <div className="bg-white px-6 py-5 row-start-2 space-y-1 overflow-scroll">
        <h3 className='font-extrabold'>Talk to {cls.instructor}</h3>
        <p className="text-sm">{cls.ageGroup === "all" ? "All Ages" : "For " + cls.ageGroup.charAt(0).toUpperCase() + cls.ageGroup.slice(1)}</p>
        <div ref={scheduleRef} className="grid grid-rows-[auto_auto] auto-cols-min overflow-scroll items-center gap-x-4 gap-y-3 mb-1 pb-4">
          <IoTimeOutline className="text-xl row-start-1" />
          <IoCalendarOutline className="text-xl row-start-2" />

          {cls.schedule.map((schedule, index) => {
            const convertedStartTimeEST = schedule?.startTime
              ? convertTime(schedule.day, schedule.startTime, "Etc/UTC", "America/New_York")
              : { time: '' };
            const convertedEndTimeEST = schedule?.endTime
              ? convertTime(schedule.day, schedule.endTime, "Etc/UTC", "America/New_York")
              : { time: '' };
            const convertedStartTimeIST = schedule?.startTime
              ? convertTime(schedule.day, schedule.startTime, "Etc/UTC", "Europe/Istanbul")
              : { time: '' };
            const convertedEndTimeIST = schedule?.endTime
              ? convertTime(schedule.day, schedule.endTime, "Etc/UTC", "Europe/Istanbul")
              : { time: '' };

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
                {index !== cls.schedule.length - 1 && <div className="row-span-full h-full border-[1px]"></div>}
              </React.Fragment>
            )
          })}
        </div>
        {showScrollHint && (
          <p className="text-xs italic text-neutral-400 mb-4">Scroll to see more times →</p>
        )}
      </div>
      <div className="mb-4 ml-5"><Button label="Enroll" /></div>
    </div>
  )
}

export default SupplementaryClass;