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
import { localizeNumber } from "@/utils/formatters";

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

  if (user.enrolledClasses.includes(classObj._id)) {
    return (
      <Overlay width={'w-[28rem]'}>
        <div>
          <h3 className='font-extrabold'>{t('already_enrolled')}</h3>
          <p className='sm:text-lg'>{t('already_enrolled_desc')}</p>
        </div>
        <div className="grid grid-cols-2 w-fit gap-x-2">
          <Button
            label={t("unenroll")}
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
            label={t('cancel')}
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
            <h3 className='font-extrabold'>{t('registering_for')}</h3>
            <p className='text-base sm:text-lg'>
              {t('level_num', { num: localizeNumber(classObj.level, i18n.language), ns: "levels" })}: {classObj.ageGroup === "all" ? t(`for_${classObj.ageGroup}`) : t(`${classObj.ageGroup}_class`)}
            </p>
          </div>
          <p className="text-base text-[#86858F]">{t('instructor_name', { name: classObj.instructor })}</p>
          <div className="grid grid-rows-2 w-min items-center gap-x-2 gap-y-1">
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
        </div>
        <div className='grid grid-cols-2 w-fit gap-x-2'>
          <Button label={t("confirm")} onClick={handleEnrollOrUnenroll} />
          <Button
            label={t("cancel")}
            isOutline={true}
            onClick={() => { setShowPopup(false) }} />
        </div>
      </div> : <div className='flex flex-col gap-y-5'>
        <div className='flex flex-col gap-y-4'>
          <div>
            <h3 className='font-extrabold'>{t('congrats_registered')}</h3>
            <p className='text-base sm:text-lg'>
              {t('level_num', { num: localizeNumber(classObj.level, i18n.language), ns: "levels" })}: {classObj.ageGroup === "all" ? t(`for_${classObj.ageGroup}`) : t(`${classObj.ageGroup}_class`)} ({t('with_name', { name: classObj.instructor })})
            </p>
          </div>
          <p className='text-base text-[#86858F]'>{t('congrats_registered_desc')}</p>
        </div>
        <div className='grid grid-cols-2 w-fit gap-x-2'>
          <Button label={t('my_schedule')} onClick={() => {
            setUser(prev => ({
              ...prev,
              enrolledClasses: [...prev.enrolledClasses, classObj._id]
            }))
            setLocation('/student')
          }} />
          <Button
            label={t('undo')}
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
  const { t, i18n } = useTranslation();
  const handleUnenroll = async () => {
    await unenrollInClass(classObj._id, userId);
    setShowPopup(false);
    window.location.reload();
  }

  return (
    <Overlay width={'w-[22rem]'}>
      <div className="space-y-1">
        <h3 className='font-extrabold'>{t('unenroll_confirmation')}</h3>
        <p className='text-base sm:text-lg'>
          {t('level_num', { num: localizeNumber(classObj.level, i18n.language), ns: "levels" })}: {classObj.ageGroup === "all" ? t(`for_${classObj.ageGroup}`) : t(`${classObj.ageGroup}_class`)}
        </p>
      </div>
      <div className='grid grid-cols-2 w-fit gap-x-2'>
        <Button label={t('confirm')} onClick={handleUnenroll} />
        <Button
          label={t('cancel')}
          isOutline={true}
          onClick={() => setShowPopup(false)} />
      </div>
    </Overlay>
  )
}

const SignUpPopup = ({ setShowPopup }) => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  // TODO: issue is button text exceeding boundaries of button in other languages
  return (
    <Overlay width={'w-[24rem]'}>
      <div>
        <h3 className='font-extrabold'>{t('create_account_first')}</h3>
        <p className='text-base sm:text-lg'>{t('create_account_first_desc')}</p>
      </div>
      <div className='grid grid-cols-2 w-fit gap-x-2'>
        <Button label={t('sign_up')} onClick={() => setLocation("/signup")} />
        <Button
          label={t('cancel')}
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
        <h3 className='font-extrabold'>{t('not_student')}</h3>
        <p className='text-base sm:text-lg'>{t('not_student_desc')}</p>
      </div>
      <div className='grid grid-cols-2 w-fit gap-x-2'>
        <SignOutButton
          redirectUrl='/login'
          className='transition-colors duration-300 border border-dark-blue-800 text-white bg-dark-blue-800 hover:text-dark-blue-800 hover:bg-white rounded-sm px-4 py-2'>
          {t('sign_out')}
        </SignOutButton>
        <Button
          label={t('cancel')}
          isOutline={true}
          onClick={() => setShowPopup(false)} />
      </div>
    </Overlay>
  )
}

const EnrollButton = ({ classObj, isEnroll }) => {
  const [showEnrollPopup, setShowEnrollPopup] = useState(false);
  const [showUnenrollPopup, setShowUnenrollPopup] = useState(false);
  const [showSignUpPopup, setShowSignUpPopup] = useState(false);
  const [showNotStudentPopup, setShowNotStudentPopup] = useState(false);
  const { isSignedIn } = useUser();
  const { user } = useContext(UserContext);
  const { t } = useTranslation();

  return (
    <>
      {isEnroll ? <Button
        label={classObj.isEnrollmentOpen ? t('enroll') : t('enrollment_closed')}
        onClick={
          isSignedIn
            ? user.privilege === "student"
              ? () => setShowEnrollPopup(true)
              : () => setShowNotStudentPopup(true)
            : () => setShowSignUpPopup(true)}
        isDisabled={!classObj.isEnrollmentOpen}
      /> : <Button
        label={t("unenroll")}
        onClick={() => {
          setShowUnenrollPopup(true)
        }}
      />}
      {showEnrollPopup && <EnrollPopup
        isEnroll={isEnroll}
        classObj={classObj}
        userId={user._id}
        setShowPopup={setShowEnrollPopup} />}
      {showUnenrollPopup && <UnenrollPopup
        classObj={classObj}
        userId={user._id}
        setShowPopup={setShowUnenrollPopup} />}
      {showSignUpPopup && <SignUpPopup
        setShowPopup={setShowSignUpPopup} />}
      {showNotStudentPopup && <NotStudentPopup
        setShowPopup={setShowNotStudentPopup} />}
    </>
  )
}

export default EnrollButton;