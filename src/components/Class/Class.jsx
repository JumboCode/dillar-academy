
import React, { useContext } from 'react'
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import EnrollButton from '@/components/Button/EnrollButton'
import Button from '@/components/Button/Button'
import EditButton from '@/components/Button/EditButton'
import { UserContext } from "../../contexts/UserContext";
import { useTranslation } from "react-i18next";

// possible modes: enroll, unenroll, edit, delete
// editURL used for edit page URL to navigate to
// handleDelete is function used for deleting class
const Class = ({ classObj, modes = ["enroll"], editURL = "", handleDelete = null, isSimplified }) => {
  const { t } = useTranslation();
  const { user, } = useContext(UserContext);

  return isSimplified ? (
    <div className='shadow-shadow hover:shadow-shadow-hover transition-shadow rounded-2xl py-8 px-7 flex gap-x-3 items-center justify-between'>
      <div className='flex items-center gap-x-6'>
        <h3 className='text-dark-blue-800 font-extrabold'>Level {classObj.level}</h3>
        <p className='text-neutral-600'>
          {classObj.ageGroup === "all" ? 'All Ages' : `${classObj.ageGroup.charAt(0).toUpperCase() + classObj.ageGroup.slice(1)}'s Class`}
        </p>
      </div>
      <p className='sm:text-lg'>Taught by {classObj.instructor}</p>
    </div>
  ) : (
    <div className="p-6 bg-white rounded-lg shadow-shadow overflow-hidden hover:shadow-shadow-hover transition-shadow">
      {/* Header */}
      <div className='mb-4'>
        <h3 className="font-extrabold text-dark-blue-800 mb-1">
          {classObj.ageGroup === "all" ? 'All Ages' : `${classObj.ageGroup.charAt(0).toUpperCase() + classObj.ageGroup.slice(1)}'s Class`}
        </h3>
        <span className="text-sm text-neutral-400">with {classObj.instructor}</span>
      </div>
      {/* Schedule */}
      <div className="grid grid-rows-2 grid-cols-[min-content] items-center gap-x-2 gap-y-1 mb-5">
        <IoTimeOutline className="text-xl row-start-1" />
        <IoCalendarOutline className="text-xl row-start-2" />
        {classObj.schedule.map((schedule, index) => (
          <React.Fragment key={index}>
            {index === 1 && <div className="row-span-full w-0 h-full border-[1px]"></div>}
            <p className="row-start-1">{schedule.time}</p>
            <p className="row-start-2">{schedule.day}</p>
          </React.Fragment>
        ))}
      </div>
      <div className='flex gap-3'>
        {modes.includes("enroll") &&
          <EnrollButton
            userId={user?._id}
            classObj={classObj}
            isEnroll={true}
          />
        }
        {modes.includes("edit") && <EditButton classId={classObj._id} editURL={editURL} />}
        {modes.includes("delete") && <Button label="Delete" onClick={handleDelete} />}
        {modes.includes("unenroll") &&
          <EnrollButton
            userId={user?._id}
            classObj={classObj}
            isEnroll={false}
          />
        }
      </div>
    </div>
  );
};

export default Class;