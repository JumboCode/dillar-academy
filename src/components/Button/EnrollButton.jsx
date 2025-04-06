import React, { useState } from 'react'
import Button from '@/components/Button/Button'
import { enrollInClass, unenrollInClass } from '@/api/class-wrapper';
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import { useLocation } from 'wouter';
import { useUser } from '@clerk/clerk-react';
import { useTranslation } from "react-i18next";

const EnrollPopup = ({ isEnroll, classObj, userId, setShowPopup }) => {
  const { t } = useTranslation();
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
              <h3 className='font-extrabold'>You are registering for:</h3>
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
          <div className='flex gap-x-2'>
            <Button label={"Confirm"} onClick={handleEnrollOrUnenroll} />
            <Button
              label={"Cancel"}
              isOutline={true}
              onClick={() => {
                isEnroll = false;
                handleEnrollOrUnenroll();
              }} />
          </div>
        </div> : <div className='flex flex-col gap-y-5'>
          <div className='flex flex-col gap-y-4'>
            <div>
              <h3 className='font-extrabold'>Congrats! You are registered for: </h3>
              <p className='text-base sm:text-lg'>Level {classObj.level}: {classObj.ageGroup === "all" ? 'All Ages' : `${classObj.ageGroup.charAt(0).toUpperCase() + classObj.ageGroup.slice(1)}'s Class`} (with {classObj.instructor})</p>
            </div>
            <p className='text-base text-[#86858F]'>Checkout your class schedule in your profile! Made a mistake? Select “Undo”</p>
          </div>
          <div className='flex gap-x-2'>
            <Button label={"My Schedule"} onClick={() => setLocation('/student')} />
            <Button
              label={"Undo"}
              isOutline={true}
              onClick={() => {
                setShowPopup(false)
                isEnroll = false;
                handleEnrollOrUnenroll();
              }} />
          </div>
        </div>}
      </div>
    </div>
  )
}

const UnenrollPopup = ({ classObj, userId, setShowPopup }) => {
  const { t } = useTranslation();
  const handleUnenroll = async () => {
    await unenrollInClass(classObj._id, userId);
    setShowPopup(false);
    window.location.reload();
  }

  return (
    <div className="bg-black bg-opacity-30 fixed z-50 inset-0 grid place-items-center">
      <div className="w-[22rem] bg-white rounded-lg p-6 space-y-5">
        <div className="space-y-1">
          <h3 className='font-extrabold'>Are you sure you want to unenroll from:</h3>
          <p className='text-base sm:text-lg'>Level {classObj.level}: {classObj.ageGroup === "all" ? 'All Ages' : `${classObj.ageGroup.charAt(0).toUpperCase() + classObj.ageGroup.slice(1)}'s Class`}</p>
        </div>
        <div className='flex gap-x-2'>
          <Button label={"Confirm"} onClick={handleUnenroll} />
          <Button
            label={"Cancel"}
            isOutline={true}
            onClick={() => setShowPopup(false)} />
        </div>
      </div>
    </div>
  )
}

const SignUpPopup = ({ setShowPopup }) => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  return (
    <div className="bg-black bg-opacity-30 fixed z-50 inset-0 grid place-items-center">
      <div className="w-[24rem] bg-white rounded-lg p-6 space-y-5">
        <div>
          <h3 className='font-extrabold'>Create an account first!</h3>
          <p className='text-base sm:text-lg'>Please sign up for an account with Dillar before registering for classes.</p>
        </div>
        <div className='flex gap-x-2'>
          <Button label={"Sign Up"} onClick={() => setLocation("/signup")} />
          <Button
            label={"Cancel"}
            isOutline={true}
            onClick={() => setShowPopup(false)} />
        </div>
      </div>
    </div>
  )
}

const EnrollButton = ({ userId, classObj, isEnroll }) => {
  const [showEnrollPopup, setShowEnrollPopup] = useState(false);
  const [showUnenrollPopup, setShowUnenrollPopup] = useState(false);
  const [showSignUpPopup, setShowSignUpPopup] = useState(false);
  const { isSignedIn } = useUser();

  return (
    <>
      {isEnroll ? <Button
        label={"Enroll"}
        isOutline={false}
        onClick={isSignedIn ? () => setShowEnrollPopup(true) : () => setShowSignUpPopup(true)}
      /> : <Button
        label={"Unenroll"}
        isOutline={false}
        onClick={() => {
          setShowUnenrollPopup(true)
        }}
      />}
      {showEnrollPopup && <EnrollPopup
        isEnroll={isEnroll}
        classObj={classObj}
        userId={userId}
        setShowPopup={setShowEnrollPopup} />}
      {showUnenrollPopup && <UnenrollPopup
        classObj={classObj}
        userId={userId}
        setShowPopup={setShowUnenrollPopup} />}
      {showSignUpPopup && <SignUpPopup
        setShowPopup={setShowSignUpPopup} />}
    </>
  )
}

export default EnrollButton;