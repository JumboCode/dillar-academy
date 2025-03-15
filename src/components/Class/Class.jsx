
import React, { useContext } from 'react'
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import EnrollButton from '@/components/Button/EnrollButton'
import Button from '@/components/Button/Button'
import EditButton from '@/components/Button/EditButton'
import { UserContext } from "../../contexts/UserContext";

// possible modes: enroll, unenroll, edit, delete
// editURL used for edit page URL to navigate to
// handleDelete is function used for deleting class
const Class = ({ classObj, modes = ["enroll"], editURL = "", handleDelete = null }) => {
  const { user, } = useContext(UserContext);
  return (
    <div className="p-6 bg-white rounded-lg shadow-shadow overflow-hidden hover:shadow-shadow-hover transition-shadow">
      {/* Header */}
      <div className='mb-4'>
        <h5 className="font-extrabold text-dark-blue-800 mb-1">
          {classObj.ageGroup === "all" ? 'All Ages' : `${classObj.ageGroup.charAt(0).toUpperCase() + classObj.ageGroup.slice(1)}'s Class`}
        </h5>
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