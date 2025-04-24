import { useContext, useEffect, useState } from 'react';
import { getClassById, getStudentsClasses } from '@/api/class-wrapper';
import { updateUser } from '@/api/user-wrapper';
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react'
import Class from '@/components/Class/Class'
import Button from '@/components/Button/Button';
import FormInput from '@/components/Form/FormInput';
import Overlay from '@/components/Overlay';
import Schedule from '@/components/Schedule';
import { IoAdd, IoCreateOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SkeletonClass from '@/components/Skeletons/SkeletonClass';
import SkeletonSchedule from '@/components/Skeletons/SkeletonSchedule';
import Unauthorized from '../Unauthorized';

const StudentPortal = () => {
  const [classes, setClasses] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isLoaded, isSignedIn } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    gender: '',
  });
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const response = await getStudentsClasses(user?._id);
        const classes = await Promise.all(
          response.enrolledClasses.map(async (classID) => {
            const classResponse = await getClassById(classID);
            return classResponse; // Return the class details
          })
        );
        setClasses(classes);
        setAllowRender(true);
      }
    };

    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        fetchData();
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const toTitleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(user._id, editFormData);
      setUser(prev => ({
        ...prev,
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
        age: editFormData.age,
        gender: editFormData.gender
      }))
      setShowEditModal(false);
      setEditFormData({ firstName: '', lastName: '', email: '', age: '', gender: '' });
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const openEditUser = () => {
    setEditFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      age: user.age || '',
      gender: user.gender ? toTitleCase(user.gender) : '',
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevEditFormData) => ({
      ...prevEditFormData,
      [name]: value,
    }));
  };

  if (user && user.privilege !== "student") {
    return <Unauthorized />
  }

  return (
    <div className='page-format max-w-[96rem] lg:py-24 space-y-12'>
      <div>
        {allowRender
          ? <div className='flex flex-col sm:flex-row sm:items-end gap-x-5 mb-1'>
            <h1 title={allowRender ? `${toTitleCase(user.firstName)} ${toTitleCase(user.lastName)}` : ""} className='font-extrabold truncate'>
              {`${t("welcome")} ${toTitleCase(user.firstName)} ${toTitleCase(user.lastName)}!`}
            </h1>
            <p className='text-blue-500'>{allowRender ? t(`${user.privilege}`) : ""}</p>
          </div>
          : <div className='w-full sm:w-1/2'>
            <h1><Skeleton /></h1>
          </div>}
        <div className="text-gray-500 text-sm sm:text-base mb-4 w-full">
          {allowRender
            ? <button onClick={openEditUser} className='flex gap-x-2 items-center'>
              <IoCreateOutline className="font-extrabold" />
              <p>{t("edit_profile")}</p>
            </button>
            : <div className='w-1/4 sm:w-1/6 lg:w-1/12'>
              <Skeleton />
            </div>}
        </div>
        <div className="grid grid-cols-[max-content_auto] w-fit gap-x-4 gap-y-1">
          {allowRender
            ? <><p className='text-black col-start-1'>{t("email")}</p>
              <p className='text-gray-500 col-start-2'>{user.email}</p>
              <p className='text-black col-start-1'>{t("whatsapp")}</p>
              <p className='text-gray-500 col-start-2'>{user.email}</p>
              <p className='text-black col-start-1'>{t("age")}</p>
              <p className='text-gray-500 col-start-2'>{user.age ? user.age : "N/A"}</p>
              <p className='text-black col-start-1'>{t("gender")}</p>
              <p className='text-gray-500 col-start-2'>{user.gender ? toTitleCase(user.gender) : "N/A"}</p></>
            : <div className='w-40 lg:w-64'>
              <Skeleton count={4} />
            </div>}
        </div>
      </div>

      <section className='my-12'>
        <h2 className='font-extrabold mb-6'>{allowRender ? t("your_courses") : <Skeleton width={"12rem"} />}</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {classes.map((classObj, classIndex) => (
            <Class key={classIndex} classObj={classObj} modes={["unenroll"]} />
          ))}
          {!allowRender && <SkeletonClass count={3} />}
          <div className="flex justify-center sm:justify-normal items-center w-full">
            {allowRender && <Button
              label={<IoAdd className="text-2xl font-extrabold" />}
              isRound
              onClick={() => setLocation("/levels")}
            />}
          </div>
        </div>
      </section>

      <section>
        <h2 className='font-extrabold my-8'>{allowRender ? t("class_schedule") : <Skeleton width={"12rem"} />}</h2>
        {allowRender ? <Schedule privilege={user.privilege} classes={classes} /> : <SkeletonSchedule />}
      </section>

      {showEditModal && (
        <Overlay width={'w-1/2'}>
          <form onSubmit={handleEditUser} className="flex flex-col gap-y-6 py-3 px-2">
            <div className="sm:flex gap-y-6 sm:gap-y-0 sm:gap-x-6">
              <div className="w-full">
                <label>{t("first_name")}</label>
                <FormInput
                  type="text"
                  name="firstName"
                  placeholder={t("first_name")}
                  value={editFormData.firstName}
                  onChange={handleInputChange}
                  isRequired={true}
                />
              </div>
              <div className="w-full">
                <label>{t("last_name")}</label>
                <FormInput
                  type="text"
                  name="lastName"
                  placeholder={t("last_name")}
                  value={editFormData.lastName}
                  onChange={handleInputChange}
                  isRequired={true}
                />
              </div>
            </div>
            <div className="w-full">
              <label>{t("email")}</label>
              <FormInput
                type="email"
                name="email"
                placeholder={t("email")}
                value={editFormData.email}
                onChange={handleInputChange}
                isRequired={true}
              />
            </div>
            <div className='w-full'>
              <label>{t("age")}</label>
              <FormInput
                type="text"
                name="age"
                placeholder={t("age")}
                value={editFormData.age}
                onChange={handleInputChange}
                isRequired={false}
              />
            </div>
            <div className="w-full">
              <label>{t("gender")}</label>
              <FormInput
                type="text"
                name="gender"
                placeholder={t("gender")}
                value={editFormData.gender}
                onChange={handleInputChange}
                isRequired={false}
              />
            </div>
            <div className="grid grid-cols-2 gap-x-2">
              <Button
                label={t("cancel")}
                isOutline={true}
                onClick={() => {
                  setShowEditModal(false);
                  setEditFormData({ firstName: '', lastName: '', email: '', age: '', gender: '' });
                }}
              />
              <Button label={t("save")} type="submit" />
            </div>
          </form>
        </Overlay>
      )}
    </div>
  );
}

export default StudentPortal;