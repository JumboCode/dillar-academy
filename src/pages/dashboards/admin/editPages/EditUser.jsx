import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { updateUser, getUser, deleteUser } from '@/wrappers/user-wrapper.js';
import { getClassById, getAllClasses, enrollInClass, unenrollInClass } from '@/wrappers/class-wrapper';
import FormInput from '@/components/Form/FormInput';
import PhoneInput from '@/components/Form/PhoneInput/PhoneInput';
import Button from '@/components/Button/Button';
import Dropdown from '@/components/Dropdown/Dropdown';
import BackButton from "@/components/Button/BackButton";
import Class from '@/components/Class/Class';
import Overlay from '@/components/Overlay';
import SearchBar from '@/components/SearchBar';
import Alert from '@/components/Alert';
import DeleteButton from "@/components/Button/DeleteButton";
import Unauthorized from "@/pages/Unauthorized";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SkeletonClass from '@/components/Skeletons/SkeletonClass';
import useDelayedSkeleton from '@/hooks/useDelayedSkeleton';
import { toTitleCase } from '@/utils/formatters';
import { isPossiblePhoneNumber } from 'react-phone-number-input';

const EditUser = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const params = useParams();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [classes, setClasses] = useState([]);
  const [userClasses, setUserClasses] = useState([]);
  const [userData, setUserData] = useState(null);
  const [userFormData, setUserFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    privilege: ''
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const showSkeleton = useDelayedSkeleton(!allowRender);

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        fetchData();
      }
    }

  }, [isLoaded, isSignedIn, user]);

  const fetchData = async () => {
    try {
      const allClasses = await getAllClasses();
      setClasses(allClasses);
      const userFilter = new URLSearchParams(`_id=${params.id}`);
      const userData = await getUser(userFilter);
      setUserFormData({
        firstName: userData.data.firstName,
        lastName: userData.data.lastName,
        email: userData.data.email,
        whatsapp: userData.data.whatsapp || '',
        privilege: userData.data.privilege
      });
      let userClasses;
      if (userData.data.privilege === "student") {
        userClasses = await Promise.all(
          userData.data.enrolledClasses.map(async (classID) => {
            const classResponse = await getClassById(classID);
            return classResponse; // Return the class details
          })
        );
      } else {
        userClasses = await getAllClasses(`instructor=${toTitleCase(userData.data.firstName)}`)
      }
      setUserClasses(userClasses);
      setUserData(userData.data);
      setAllowRender(true);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  const handleUserInputChange = (e) => {
    setUserFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      if (isPossiblePhoneNumber(userFormData.whatsapp) || userFormData.whatsapp === "") {
        setIsSaving(true);
        await updateUser(params.id, userFormData);
        setSuccessMessage("Successfully updated user information")
        setUserFormData({ firstName: '', lastName: '', email: '', whatsapp: '', privilege: '' })
        await fetchData();
        setTimeout(() => {
          setSuccessMessage("");
        }, 4000);
        setIsSaving(false);
      } else {
        setAlertMessage(`Error: Phone number is invalid`);
        setTimeout(() => {
          setAlertMessage("");
        }, 4000);
      }
    } catch (error) {
      setIsSaving(false);
      console.error('Error updating user:', error);
      setAlertMessage(`Error: ${error.response.data.message}`)
      setTimeout(() => {
        setAlertMessage("");
      }, 4000);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(params.id);
      history.back();
    } catch (error) {
      console.error('Error deleting user:', error);
      setAlertMessage(`Error: ${error.response.data.message}`);
      setTimeout(() => {
        setAlertMessage("")
      }, 4000);
    }
  }

  const handleReset = () => {
    setUserFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      whatsapp: userData.whatsapp || '',
      privilege: userData.privilege
    });
  }

  const filteredClasses = classes.filter((cls) => {
    const search = searchInput.toLowerCase().split(" ");
    if (search.length <= 1 && search[0] === '') {
      return true;
    }

    const matchesClass =
      search.includes(String(cls.level)) ||
      search.some(term => cls.ageGroup.toLowerCase().includes(term)) ||
      search.some(term => cls.instructor.toLowerCase().includes(term));

    return matchesClass;
  });

  if (user && user.privilege !== "admin") {
    return <Unauthorized />;
  }


  return (
    <>
      {alertMessage !== "" && <Alert message={alertMessage} />}
      {successMessage !== "" && <Alert message={successMessage} isSuccess />}
      <div className={`page-format max-w-[96rem] space-y-10`}>
        <BackButton label="Back" />
        {allowRender ? <div className='flex flex-col sm:flex-row flex-wrap sm:items-end gap-x-5 mb-1'>
          <h1
            title={`Name: ${toTitleCase(userData.firstName)} ${toTitleCase(userData.lastName)}`}
            className='font-extrabold w-fit max-w-full break-words'>
            {toTitleCase(userData.firstName) + " " + toTitleCase(userData.lastName)}
          </h1>
          <p className='text-blue-500'>{toTitleCase(userData.privilege)}</p>
        </div> : showSkeleton && <h1 className="w-full sm:w-1/2"><Skeleton /></h1>}
        <form onSubmit={handleEditUser} className="w-full lg:w-2/3 space-y-12">
          <div className="flex flex-col gap-y-6 py-3 px-2">
            <div className="sm:flex gap-y-6 sm:gap-y-0 sm:gap-x-6">
              <div className="w-full">
                <label>First Name</label>
                <FormInput
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={userFormData.firstName}
                  onChange={handleUserInputChange}
                  isRequired={true}
                />
              </div>
              <div className="w-full">
                <label>Last Name</label>
                <FormInput
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={userFormData.lastName}
                  onChange={handleUserInputChange}
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
                value={userFormData.email}
                onChange={handleUserInputChange}
                isRequired={true}
              />
            </div>
            <div className="w-full">
              <label>WhatsApp</label>
              <PhoneInput
                name="whatsapp"
                value={userFormData.whatsapp}
                setValue={handleUserInputChange}
              />
            </div>
            <div className="w-full flex flex-col">
              <label>Privilege</label>
              <Dropdown
                label={
                  <div className="flex items-center justify-center gap-x-1">
                    <span className={`text-center w-full ${userFormData.privilege ? "" : "text-gray-500"}`}>
                      {userFormData.privilege ? toTitleCase(userFormData.privilege) : "Select Role"}
                    </span>
                  </div>
                }
                buttonClassName="justify-between w-full text-base sm:text-lg py-3 px-4 border border-gray-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {["student", "instructor"].map((role) => (
                  <button
                    type="button"
                    key={role}
                    className={`
                    block w-full py-3 px-4 text-base sm:text-lg 
                    ${userFormData.privilege === role ? 'text-blue-500 bg-gray-50' : 'text-gray-700'}
                    hover:bg-gray-100`}
                    onClick={() => setUserFormData({ ...userFormData, privilege: role })}
                  >
                    {toTitleCase(role)}
                  </button>
                ))}
              </Dropdown>
            </div>
          </div>
          <div className="space-x-2">
            <Button label={isSaving ? "Saving..." : "Save"} type="submit" isDisabled={isSaving} />
            <Button
              label="Reset"
              isOutline={true}
              onClick={handleReset} />
          </div>
          <DeleteButton item="user" onDelete={handleDeleteUser} />
        </form>
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center mb-6 gap-8">
            <h2>
              {allowRender ? `${toTitleCase(userData.firstName)}'s Classes` : showSkeleton && <Skeleton className="w-48" />}
            </h2>
            {allowRender && userData.privilege === "student" && <div className="flex items-center">
              <Button
                label={"Edit User's Classes"}
                onClick={() => setShowOverlay(true)}
              />
            </div>
            }
          </div>
          <div className="grid grid-cols-3 gap-6">
            {allowRender
              ? userClasses.map((classObj) => (
                <Class
                  key={classObj._id}
                  classObj={classObj}
                  modes={["edit"]}
                  editURL={(() => {
                    switch (true) {
                      case typeof classObj.level === "number":
                        return `/admin/levels/class`;
                      case classObj.level === "conversation":
                        return `/admin/levels/conversations`;
                      case classObj.level === "ielts":
                        return `/admin/levels/ielts`;
                    }
                  })()} />
              ))
              : showSkeleton && <SkeletonClass count={3} />}
          </div>
        </div>

        {showOverlay && <Overlay width={'w-[96%] md:w-4/5 lg:w-2/3'}>
          <h3 className="font-extrabold">Search for class</h3>
          <SearchBar input={searchInput} setInput={setSearchInput} placeholder="Search for class by level, age, instructor" />
          <div className="h-[50vh] overflow-y-auto mt-4 flex flex-col gap-y-3">
            {filteredClasses
              .sort((l1, l2) => l1.level - l2.level)
              .map(classObj => {
                const isEnrolled = userData.enrolledClasses.includes(classObj._id);
                return (
                  <button
                    key={classObj._id}
                    className={`${isEnrolled && 'border-2 border-blue-300 rounded-lg *:bg-blue-100'}`}
                    disabled={!classObj.isEnrollmentOpen}
                    onClick={async () => {
                      if (isEnrolled) {
                        await unenrollInClass(classObj._id, userData._id);
                      } else {
                        await enrollInClass(classObj._id, userData._id);
                      }
                      await fetchData();
                    }}
                  >
                    <Class classObj={classObj} isSimplified />
                  </button>
                )
              })}
          </div>
          <Button label={'Close'} onClick={() => setShowOverlay(false)} />
        </Overlay>}
      </div>
    </>
  )
}

export default EditUser;