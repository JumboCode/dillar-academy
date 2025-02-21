import React from 'react'
import Button from '@/components/Button/Button'
import { enrollInClass, getClassById, unenrollInClass } from '@/api/class-wrapper';
import { useUser } from '@clerk/clerk-react';
import { useState } from 'react';
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import { useLocation } from 'wouter';

const EnrollPopup = ({ isEnroll, classObj, userId, setShowPopup }) => {
  const [confirming, setConfirming] = useState(true);
  const [, setLocation] = useLocation();

  const handleEnrollOrUnenroll = async () => {
    if (isEnroll) {
      await enrollInClass(classObj._id, userId);
    } else {
      await unenrollInClass(classObj._id, userId);
      setShowPopup(false);
    }
    setConfirming(false);
  }

  return (
    <div className='bg-black bg-opacity-30 fixed z-50 inset-0 grid place-items-center'>
      <div className='w-[28rem] bg-white rounded-lg p-6'>
        {confirming ? <div className='flex flex-col gap-y-5'>
          <div className='flex flex-col gap-y-4'>
            <div>
              <h5 className='font-extrabold'>You are registering for:</h5>
              <p className='text-base sm:text-lg'>Level {classObj.level}: {classObj.ageGroup === "all" ? 'All Ages' : `${classObj.ageGroup.charAt(0).toUpperCase() + classObj.ageGroup.slice(1)}'s Class`}</p>
            </div>
            <p className="text-base text-[#86858F]">Instructor: {classObj.instructor}</p>
            <div className="grid grid-rows-2 grid-cols-[min-content] items-center gap-x-2 gap-y-1">
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
          </div>
          <span className='flex gap-x-2'>
            <Button label={"Confirm"} onClick={handleEnrollOrUnenroll} />
            <Button
              label={"Cancel"}
              isOutline={true}
              onClick={() => {
                isEnroll = false;
                handleEnrollOrUnenroll();
              }} />
          </span>
        </div> : <div className='flex flex-col gap-y-5'>
          <div className='flex flex-col gap-y-4'>
            <div>
              <h5 className='font-extrabold'>Congrats! You are registered for: </h5>
              <p className='text-base sm:text-lg'>Level {classObj.level}: {classObj.ageGroup === "all" ? 'All Ages' : `${classObj.ageGroup.charAt(0).toUpperCase() + classObj.ageGroup.slice(1)}'s Class`} (with {classObj.instructor})</p>
            </div>
            <p className='text-base text-[#86858F]'>Checkout your class schedule in your profile! Made a mistake? Select “Undo”</p>
          </div>
          <span className='flex gap-x-2'>
            <Button label={"My Schedule"} onClick={() => setLocation('/student')} />
            <Button label={"Undo"} isOutline={true} onClick={() => setShowPopup(false)} />
          </span>
        </div>}
      </div>
    </div>
  )
}

const UnenrollPopup = ({ isEnroll, classObj, userId, setShowPopup }) => {

}

const SignInPopup = () => {
  return (
    <div className='bg-black bg-opacity-30 fixed z-50 inset-0 grid place-items-center'>
      <div className='w-[28rem] bg-white rounded-lg p-6'>

      </div>
    </div>
  )
}

const EnrollButton = ({ userId, classObj, isEnroll }) => {
  const { user, isSignedIn } = useUser();
  const [showEnrollPopup, setShowEnrollPopup] = useState(false);
  const [showUnenrollPopup, setShowUnenrollPopup] = useState(false);
  const [showSignInPopup, setShowSignInPopup] = useState(false);

  return (
    <>
      <Button label={isEnroll ? "Enroll" : "Unenroll"} isOutline={false} onClick={() => setShowEnrollPopup(true)}></Button>
      {showEnrollPopup && <EnrollPopup isEnroll={isEnroll} classObj={classObj} userId={userId} setShowPopup={setShowEnrollPopup} />}
    </>
  )
}

export default EnrollButton;