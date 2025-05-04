import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react'
import { updateUser } from '@/wrappers/user-wrapper';
import { getClasses } from '@/wrappers/class-wrapper'
import { IoCreateOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import Button from '@/components/Button/Button';
import FormInput from '@/components/Form/FormInput';
import PhoneInput from '@/components/Form/PhoneInput/PhoneInput';
import Overlay from '@/components/Overlay';
import Alert from '@/components/Alert';
import Schedule from '@/components/Schedule';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SkeletonSchedule from '@/components/Skeletons/SkeletonSchedule';
import useDelayedSkeleton from '@/hooks/useDelayedSkeleton';
import Unauthorized from '../Unauthorized';
import { toTitleCase } from '@/utils/formatters';
import { formatPhoneNumberIntl, isPossiblePhoneNumber } from 'react-phone-number-input';

const InstructorView = () => {
  const [classes, setClasses] = useState([])
  const { user, setUser } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    age: '',
    gender: '',
  });
  const [alertMessage, setAlertMessage] = useState("");
  const { t } = useTranslation();
  const showSkeleton = useDelayedSkeleton(!allowRender);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        let instructorClasses = await getClasses(`instructor=${toTitleCase(user.firstName)}`); // TODO: should use first and last name
        setClasses(instructorClasses);
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

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      if (isPossiblePhoneNumber(editFormData.whatsapp) || editFormData.whatsapp === "") {
        await updateUser(user._id, editFormData);
        setUser(prev => ({
          ...prev,
          firstName: editFormData.firstName,
          lastName: editFormData.lastName,
          email: editFormData.email,
          whatsapp: editFormData.whatsapp,
          age: editFormData.age,
          gender: editFormData.gender
        }))
        setShowEditModal(false);
      } else {
        setAlertMessage(`Error: Phone number is invalid`);
        setTimeout(() => {
          setAlertMessage("");
        }, 4000);
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const openEditUser = () => {
    setEditFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      whatsapp: user.whatsapp || '',
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

  if (user && user.privilege !== "instructor") {
    return <Unauthorized />
  }

  return (
    <>
      {alertMessage && <Alert message={alertMessage} />}
      <div className="page-format max-w-[96rem] space-y-12">
        <div>
          {allowRender
            ? <div className='flex flex-col sm:flex-row sm:items-end flex-wrap gap-x-5 mb-1'>
              <h1
                title={allowRender ? `Name: ${toTitleCase(user.firstName)} ${toTitleCase(user.lastName)}` : ""}
                className='font-extrabold w-fit max-w-full break-words'>
                {`${t("welcome")} ${toTitleCase(user.firstName)} ${toTitleCase(user.lastName)}!`}
              </h1>
              <p className='text-blue-500'>{allowRender ? t(`${user.privilege}`) : ""}</p>
            </div>
            : showSkeleton && <div className='w-full sm:w-1/2'>
              <h1><Skeleton /></h1>
            </div>}
          <div className="text-gray-500 text-sm sm:text-base mb-4 w-full">
            {allowRender
              ? <button onClick={openEditUser} className='flex gap-x-2 items-center'>
                <IoCreateOutline className="font-extrabold" />
                <p>{t("edit_profile")}</p>
              </button>
              : showSkeleton && <div className='w-1/4 sm:w-1/6 lg:w-1/12'>
                <Skeleton />
              </div>}
          </div>
          <div className="grid grid-cols-[max-content_auto] w-fit gap-x-4 gap-y-1">
            {allowRender
              ? <><p className='text-black col-start-1'>{t("email")}</p>
                <p className='text-gray-500 col-start-2'>{user.email}</p>
                <p className='text-black col-start-1'>{t("whatsapp")}</p>
                <p className='text-gray-500 col-start-2'>{formatPhoneNumberIntl(user.whatsapp) || "N/A"}</p>
                <p className='text-black col-start-1'>{t("age")}</p>
                <p className='text-gray-500 col-start-2'>{user.age ? user.age : "N/A"}</p>
                <p className='text-black col-start-1'>{t("gender")}</p>
                <p className='text-gray-500 col-start-2'>{user.gender ? toTitleCase(user.gender) : "N/A"}</p></>
              : showSkeleton && <div className='w-40 lg:w-64'>
                <Skeleton count={4} />
              </div>}
          </div>
        </div>
        <section>
          <h2 className='font-extrabold my-8'>{allowRender ? t("class_schedule") : showSkeleton && <Skeleton width={"12rem"} />}</h2>
          {allowRender ? <Schedule privilege={user.privilege} classes={classes} /> : showSkeleton && <SkeletonSchedule />}
        </section>
        {showEditModal && <Overlay width={'w-1/2'}>
          <form onSubmit={handleEditUser} className="flex flex-col gap-y-6 py-3 px-2">
            <div className="sm:flex gap-y-6 sm:gap-y-0 sm:gap-x-6">
              <div className="w-full">
                <label>First Name</label>
                <FormInput
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={editFormData.firstName}
                  onChange={handleInputChange}
                  isRequired={true}
                />
              </div>
              <div className="w-full">
                <label>Last Name</label>
                <FormInput
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={editFormData.lastName}
                  onChange={handleInputChange}
                  isRequired={true}
                />
              </div>
            </div>
            <div className="w-full">
              <label>Email</label>
              <FormInput
                type="email"
                name="email"
                placeholder="Email"
                value={editFormData.email}
                onChange={handleInputChange}
                isRequired={true}
              />
            </div>
            <div className="w-full">
              <label>WhatsApp</label>
              <PhoneInput
                name="whatsapp"
                value={editFormData.whatsapp}
                setValue={handleInputChange}
              />
            </div>
            <div className="sm:flex gap-y-6 sm:gap-y-0 sm:gap-x-6">
              <div className='w-full'>
                <label>Age</label>
                <FormInput
                  type="text"
                  name="age"
                  placeholder="Age"
                  value={editFormData.age}
                  onChange={handleInputChange}
                  isRequired={false}
                />
              </div>
              <div className="w-full">
                <label>Gender</label>
                <FormInput
                  type="text"
                  name="gender"
                  placeholder="Gender"
                  value={editFormData.gender}
                  onChange={handleInputChange}
                  isRequired={false}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-2">
              <Button
                label="Cancel"
                isOutline={true}
                onClick={() => {
                  setShowEditModal(false);
                  setEditFormData({ firstName: '', lastName: '', email: '', age: '', gender: '' });
                }}
              />
              <Button label="Save Info" type="submit" />
            </div>
          </form>
        </Overlay>}
      </div>
    </>
  );
};


export default InstructorView;
