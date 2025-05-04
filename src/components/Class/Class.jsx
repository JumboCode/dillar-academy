import React, { useEffect, useRef, useState } from 'react';
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import EnrollButton from '@/components/Button/EnrollButton';
import EditButton from '@/components/Button/EditButton';
import { useTranslation } from "react-i18next";
import { localizeNumber } from "@/utils/formatters";
import { convertTime, to12HourFormat } from '@/utils/time-utils';

// possible modes: enroll, unenroll, edit
// editURL used for edit page URL to navigate to
const Class = ({ classObj, modes = ["enroll"], editURL = "", isSimplified }) => {
  const { t, i18n } = useTranslation();
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

  return isSimplified ? (
    <div className='shadow-shadow hover:shadow-shadow-hover transition-shadow rounded-2xl py-8 px-7 flex gap-x-3 items-center justify-between'>
      <div className='flex items-center gap-x-6'>
        <h3 className='text-dark-blue-800 font-extrabold'>
          {t('level_num', { num: localizeNumber(classObj.level, i18n.language), ns: "levels" })}
        </h3>
        <p className='text-neutral-600'>
          {classObj.ageGroup === "all"
            ? t(`for_${classObj.ageGroup}`)
            : t(`${classObj.ageGroup}_class`)}
        </p>
      </div>
      <p className='sm:text-lg'>
        {t('taught_by_name', { name: classObj.instructor })}
      </p>
    </div>
  ) : (
    <div className="p-6 bg-white rounded-lg shadow-shadow overflow-hidden hover:shadow-shadow-hover transition-shadow">
      {/* Header */}
      <div className='mb-4'>
        <h3 className="font-extrabold text-dark-blue-800 mb-1">
          {classObj.ageGroup === "all"
            ? t(`for_${classObj.ageGroup}`)
            : t(`${classObj.ageGroup}_class`)}
        </h3>
        <p className="text-sm text-neutral-400">
          {t('with_name', { name: classObj.instructor })}
        </p>
      </div>

      {/* Schedule */}
      <div ref={scheduleRef} className="grid grid-rows-[auto_auto] auto-cols-min max-w-full overflow-scroll items-center gap-x-4 gap-y-3 mb-1 pb-4">
        <IoTimeOutline className="text-xl row-start-1" />
        <IoCalendarOutline className="text-xl row-start-2" />

        {classObj.schedule.map((schedule, index) => {
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
                {t(convertedStartTimeEST.day.toLowerCase())}
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

      <div className="flex gap-3">
        {modes.includes("enroll") && (
          <EnrollButton classObj={classObj} isEnroll={true} />
        )}
        {modes.includes("edit") && (
          <EditButton classId={classObj._id} editURL={editURL} />
        )}
        {modes.includes("unenroll") && (
          <EnrollButton classObj={classObj} isEnroll={false} />
        )}
      </div>
    </div>
  );
};

export default Class;
