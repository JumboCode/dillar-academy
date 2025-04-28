
import React from 'react'
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import EnrollButton from '@/components/Button/EnrollButton'
import EditButton from '@/components/Button/EditButton'
import { useTranslation } from "react-i18next";
import { localizeNumber } from "@/utils/formatters";

// possible modes: enroll, unenroll, edit
// editURL used for edit page URL to navigate to
const Class = ({ classObj, modes = ["enroll"], editURL = "", isSimplified }) => {
  const { t, i18n } = useTranslation();

  return isSimplified ? (
    <div className='shadow-shadow hover:shadow-shadow-hover transition-shadow rounded-2xl py-8 px-7 flex gap-x-3 items-center justify-between'>
      <div className='flex items-center gap-x-6'>
        <h3 className='text-dark-blue-800 font-extrabold'>{t('level_num', { num: localizeNumber(classObj.level, i18n.language) })}</h3>
        <p className='text-neutral-600'>
          {classObj.ageGroup === "all" ? t(`for_${classObj.ageGroup}`) : t(`${classObj.ageGroup}_class`)}
        </p>
      </div>
      <p className='sm:text-lg'>{t('taught_by_name', { name: classObj.instructor })}</p>
    </div>
  ) : (
    <div className="p-6 bg-white rounded-lg shadow-shadow overflow-hidden hover:shadow-shadow-hover transition-shadow">
      {/* Header */}
      <div className='mb-4'>
        <h3 className="font-extrabold text-dark-blue-800 mb-1">
          {classObj.ageGroup === "all" ? t(`for_${classObj.ageGroup}`) : t(`${classObj.ageGroup}_class`)}
        </h3>
        <p className="text-sm text-neutral-400">{t('with_name', { name: classObj.instructor })}</p>
      </div>
      {/* Schedule */}
      <div className="grid grid-rows-2 w-min items-center gap-x-2 gap-y-1 mb-5">
        <IoTimeOutline className="text-xl row-start-1" />
        <IoCalendarOutline className="text-xl row-start-2" />
        {classObj.schedule.map((schedule, index) => (
          <React.Fragment key={index}>
            {index === 1 && <div className="row-span-full h-full border-[1px]"></div>}
            <p className="row-start-1 w-max">{schedule.startTime}</p>
            <p className="row-start-2 w-max">{t(`${schedule.day.toLowerCase()}`)}</p>
          </React.Fragment>
        ))}
      </div>
      <div className='flex gap-3'>
        {modes.includes("enroll") &&
          <EnrollButton
            classObj={classObj}
            isEnroll={true}
          />
        }
        {modes.includes("edit") && <EditButton classId={classObj._id} editURL={editURL} />}
        {modes.includes("unenroll") &&
          <EnrollButton
            classObj={classObj}
            isEnroll={false}
          />
        }
      </div>
    </div>
  );
};

export default Class;