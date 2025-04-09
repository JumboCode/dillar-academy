import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { updateUser, getUser } from '@/api/user-wrapper.js';
import { getClassById, getClasses, enrollInClass } from '@/api/class-wrapper';
import { IoAdd } from "react-icons/io5";
import FormInput from '@/components/Form/FormInput'
import Button from '@/components/Button/Button';
import BackButton from "@/components/Button/BackButton";
import Class from '@/components/Class/Class';
import Overlay from '@/components/Overlay';
import SearchBar from '@/components/SearchBar';

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
  });

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
      setUserFormData({ firstName: '', lastName: '', email: '' })
      await fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleReset = () => {
    setUserFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
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
    <div className={`page-format max-w-[96rem] space-y-8`}>
      <BackButton label="Back" />
      <span className="flex items-baseline gap-x-5 mb-1">
        <h1 className="font-extrabold">{toTitleCase(userData.firstName) + " " + toTitleCase(userData.lastName)}</h1>
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
        </div>
        <div className="space-x-2">
          <Button label="Save" type="submit" />
          <Button
            label="Reset"
            isOutline={true}
            onClick={handleReset} />
        </div>
      </form>
      <div>
        <h2 className="font-extrabold mb-6">{toTitleCase(userData.firstName)}'s Classes</h2>
        <div className="grid grid-cols-3 gap-6">
          {userClasses.map((classObj) => (
            <Class key={classObj._id} classObj={classObj} modes={["edit"]} editURL="/admin/class" />
          ))}
          {userData.privilege === "student" && <div className="flex items-center">
            <Button
              label={<IoAdd className="text-2xl font-extrabold" />}
              onClick={() => setShowOverlay(true)}
              isRound
            />
          </div>}
        </div>
      </div>

      {/* TODO: prevent enrolling student in already enrolled class and from enrolling anybody but students */}
      {showOverlay && <Overlay width={'w-1/2'}>
        <h3>Search for class</h3>
        <SearchBar input={searchInput} setInput={setSearchInput} placeholder="Search for class by level, age, instructor" />
        <div className="h-[50vh] overflow-y-auto mt-4 flex flex-col gap-y-3">
          {filteredClasses.map(classObj => (
            <button
              key={classObj._id}
              onClick={() => {
                enrollInClass(classObj._id, userData._id);
                fetchData();
                setShowOverlay(false);
              }}
            >
              <Class classObj={classObj} isSimplified />
            </button>
          ))}
        </div>
        <Button label={'Cancel'} onClick={() => setShowOverlay(false)} />
      </Overlay>}
    </div >
  )
}

export default EditUser;