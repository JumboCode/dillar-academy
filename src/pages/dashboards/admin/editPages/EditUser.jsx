import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { updateUser, getUser, deleteUser } from '@/api/user-wrapper.js';
import { getClassById, getClasses, enrollInClass, unenrollInClass } from '@/api/class-wrapper';
import FormInput from '@/components/Form/FormInput'
import Button from '@/components/Button/Button';
import Dropdown from '@/components/Dropdown/Dropdown';
import BackButton from "@/components/Button/BackButton";
import Class from '@/components/Class/Class';
import Overlay from '@/components/Overlay';
import SearchBar from '@/components/SearchBar';
import Alert from '@/components/Alert';


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
    privilege: ''
  });
  const [alertMessage, setAlertMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        fetchData();
      }
    }

  }, [isLoaded, isSignedIn, user]);

  const toTitleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  const fetchData = async () => {
    try {
      const allClasses = await getClasses();
      setClasses(allClasses);
      const userFilter = new URLSearchParams(`_id=${params.id}`);
      const userData = await getUser(userFilter);
      setUserFormData({
        firstName: userData.data.firstName,
        lastName: userData.data.lastName,
        email: userData.data.email,
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
        userClasses = await getClasses(`instructor=${toTitleCase(userData.data.firstName)}`)
      }
      setUserClasses(userClasses);
      setUserData(userData.data);
      setAllowRender(true);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  const handleUserInputChange = (e) => {
    setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(params.id, userFormData);
      setSuccessMessage("Successfully updated user information")
      setUserFormData({ firstName: '', lastName: '', email: '', privilege: '' })
      await fetchData();
      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    } catch (error) {
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

  if (!allowRender || !userData) {
    return <div></div>;
  }

  if (user.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }


  return (
    <>
      {alertMessage !== "" && <Alert message={alertMessage} />}
      {successMessage !== "" && <Alert message={successMessage} isSuccess />}
      <div className={`page-format max-w-[96rem] space-y-8`}>
        <BackButton label="Back" />
        <span className="flex items-baseline gap-x-5 mb-1">
          <h1 title={`Name: ${toTitleCase(userData.firstName)} ${toTitleCase(userData.lastName)}`} className="font-extrabold truncate">{toTitleCase(userData.firstName) + " " + toTitleCase(userData.lastName)}</h1>
          <p className="text-blue-500">{toTitleCase(userData.privilege)}</p>
        </span>
        <form onSubmit={handleEditUser} className="space-y-12">
          <div className="flex w-full gap-x-6">
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
            <Button label="Save" type="submit" />
            <Button
              label="Reset"
              isOutline={true}
              onClick={handleReset} />
          </div>
          <Button
            label="Delete User"
            onClick={handleDeleteUser} />
        </form>
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center mb-6 gap-4">
            <h2 className="font-extrabold">{toTitleCase(userData.firstName)}'s Classes</h2>
            {userData.privilege === "student" && <div className="flex items-center">
              <Button
                label={"Edit User's Classes"}
                onClick={() => setShowOverlay(true)}
              />
            </div>}
          </div>
          <div className="grid grid-cols-3 gap-6">
            {userClasses.map((classObj) => (
              <Class key={classObj._id} classObj={classObj} modes={["edit"]} editURL="/admin/class" />
            ))}
          </div>
        </div>
        {showOverlay && <Overlay width={'w-1/2'}>
          <h3>Search for class</h3>
          <SearchBar input={searchInput} setInput={setSearchInput} placeholder="Search for class by level, age, instructor" />
          <div className="h-[50vh] overflow-y-auto mt-4 flex flex-col gap-y-3">
            {filteredClasses.map(classObj => {
              const isEnrolled = userData.enrolledClasses.includes(classObj._id);
              return (
                <button
                  key={classObj._id}
                  className={`${isEnrolled && 'border-2 border-blue-300 rounded-lg *:bg-blue-100'}`}
                  onClick={() => {
                    if (isEnrolled) {
                      unenrollInClass(classObj._id, userData._id);
                    } else {
                      enrollInClass(classObj._id, userData._id);
                    }
                    fetchData();
                  }}
                >
                  <Class classObj={classObj} isSimplified />
                </button>
              )
            })}
          </div>
          <Button label={'Close'} onClick={() => setShowOverlay(false)} />
        </Overlay>}
      </div >
    </>
  )
}

export default EditUser;