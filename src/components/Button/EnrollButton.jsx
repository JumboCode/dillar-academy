import React, { useContext, useState } from 'react';
import Button from '@/components/Button/Button';
import Overlay from '@/components/Overlay';
import { SignOutButton } from '@clerk/clerk-react'
import { enrollInClass, unenrollInClass } from '@/api/class-wrapper';
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import { useLocation } from 'wouter';
import { useUser } from '@clerk/clerk-react';
import { useTranslation } from "react-i18next";
import { UserContext } from '@/contexts/UserContext.jsx';

const EnrollPopup = ({ isEnroll, classObj, userId, setShowPopup }) => {
  const { t, i18n } = useTranslation();
  const [confirming, setConfirming] = useState(true);
  const [, setLocation] = useLocation();
  const { user, setUser } = useContext(UserContext);

  const handleEnrollOrUnenroll = async () => {
    if (isEnroll) {
      await enrollInClass(classObj._id, userId);
    } else {
      await unenrollInClass(classObj._id, userId);
      setShowPopup(false);
    }
    setConfirming(false);
  }

  function localizeNumber(number, lang) {
    let locale = lang;

    // Use Han characters for Chinese
    if (lang.startsWith('zh')) {
      locale = 'zh-CN-u-nu-hanidec';
    }

    return new Intl.NumberFormat(locale).format(number);
  }

  if (user.enrolledClasses.includes(classObj._id)) {
    return (
      <Overlay width={'w-[28rem]'}>
        <div>
          <h3 className='font-extrabold'>Already enrolled in this class</h3>
          <p className='sm:text-lg'>You are already enrolled in this class. Would you like to unenroll?</p>
        </div>
        <div className="flex gap-x-2">
          <Button
            label="Unenroll"
            onClick={() => {
              setShowPopup(false)
              isEnroll = false;
              handleEnrollOrUnenroll();
              setUser(prev => ({
                ...prev,
                enrolledClasses: user.enrolledClasses.filter(id => id !== classObj._id)
              }))
            }}
          />
          <Button
            label={"Cancel"}
            isOutline={true}
            onClick={() => { setShowPopup(false) }} />
        </div>
      </Overlay>
    )
  }

  return (
    <Overlay width={'w-[28rem]'}>
      {confirming ? <div className='flex flex-col gap-y-5'>
        <div className='flex flex-col gap-y-4'>
          <div>
            <h3 className='font-extrabold'>You are registering for:</h3>
            <p className='text-base sm:text-lg'>{t('level', { num: localizeNumber(classObj.level, i18n.language) })}: {classObj.ageGroup === "all" ? 'All Ages' : `${classObj.ageGroup.charAt(0).toUpperCase() + classObj.ageGroup.slice(1)}'s Class`}</p>
          </div>
          <p className="text-base text-[#86858F]">{t('instructor_name', { name: classObj.instructor })}</p>
          <div className="grid grid-rows-2 w-min items-center gap-x-2 gap-y-1">
            <IoTimeOutline className="text-xl row-start-1" />
            <IoCalendarOutline className="text-xl row-start-2" />
            {classObj.schedule.map((schedule, index) => (
              <React.Fragment key={index}>
                {index === 1 && <div className="row-span-full w-0 h-full border-[1px]"></div>}
                <p className="row-start-1 w-max">{schedule.time}</p>
                <p className="row-start-2 w-max">{schedule.day}</p>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className='flex gap-x-2'>
          <Button label={"Confirm"} onClick={handleEnrollOrUnenroll} />
          <Button
            label={t("cancel")}
            isOutline={true}
            onClick={() => { setShowPopup(false) }} />
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
          <Button label={"My Schedule"} onClick={() => {
            setUser(prev => ({
              ...prev,
              enrolledClasses: [...prev.enrolledClasses, classObj._id]
            }))
            setLocation('/student')
          }} />
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
    </Overlay>
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
    <Overlay width={'w-[22rem]'}>
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
    </Overlay>
  )
}

const SignUpPopup = ({ setShowPopup }) => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  return (
    <Overlay width={'w-[24rem]'}>
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
    </Overlay>
  )
}

const NotStudentPopup = ({ setShowPopup }) => {
  const { t } = useTranslation();

  return (
    <Overlay width={'w-[24rem]'}>
      <div>
        <h3 className='font-extrabold'>Not a student</h3>
        <p className='text-base sm:text-lg'>Only students are allowed to enroll in classes. Do you want to sign out and sign in as a student?</p>
      </div>
      <div className='flex gap-x-2'>
        <SignOutButton
          redirectUrl='/login'
          className='transition-colors duration-300 border border-dark-blue-800 text-white bg-dark-blue-800 hover:text-dark-blue-800 hover:bg-white rounded-sm px-4 py-2' />
        <Button
          label={"Cancel"}
          isOutline={true}
          onClick={() => setShowPopup(false)} />
      </div>
    </Overlay>
  )
}

const EnrollButton = ({ userId, classObj, isEnroll }) => {
  const [showEnrollPopup, setShowEnrollPopup] = useState(false);
  const [showUnenrollPopup, setShowUnenrollPopup] = useState(false);
  const [showSignUpPopup, setShowSignUpPopup] = useState(false);
  const [showNotStudentPopup, setShowNotStudentPopup] = useState(false);
  const { isSignedIn } = useUser();
  const { user } = useContext(UserContext);

  return (
    <>
      {isEnroll ? <Button
        label={"Enroll"}
        isOutline={false}
        onClick={
          isSignedIn
            ? user.privilege === "student"
              ? () => setShowEnrollPopup(true)
              : () => setShowNotStudentPopup(true)
            : () => setShowSignUpPopup(true)}
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
      {showNotStudentPopup && <NotStudentPopup
        setShowPopup={setShowNotStudentPopup} />}
    </>
  )
}

export default EnrollButton;