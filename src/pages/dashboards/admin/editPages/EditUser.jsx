import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { updateUser, getUser } from '@/api/user-wrapper.js';
import { getClassById, getClasses } from '@/api/class-wrapper';
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

  // TODO: if user is a teacher, fetch their classes they teach
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
        password: userData.data.password
      });
      const userClasses = await Promise.all(
        userData.data.enrolledClasses.map(async (classID) => {
          const classResponse = await getClassById(classID);
          return classResponse; // Return the class details
        })
      );
      userData.data.enrolledClasses = userClasses;
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
      setUserFormData({ firstName: '', lastName: '', email: '', password: '' })
      await fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!allowRender || !userData) {
    return <div></div>;
  }

  if (user.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className={`page-format max-w-[96rem] space-y-12`}>
      <BackButton label="Back" />
      <h1 className="font-extrabold">{userData.firstName + " " + userData.lastName}</h1>
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
      </form>
      <Button label="Save" type="submit" />
      {/* TODO: display teacher's classes */}
      <div>
        <h2 className="font-extrabold mb-6">{userData.firstName}'s Classes</h2>
        <div className="grid grid-cols-3 gap-6">
          {userData.enrolledClasses.map((classObj) => (
            <Class key={classObj._id} classObj={classObj} modes={["edit"]} editURL="/admin/class" />
          ))}
          <div className="flex items-center">
            <Button
              label={<IoAdd className="text-2xl font-extrabold" />}
              onClick={() => setShowOverlay(true)}
              isRound
            />
          </div>
        </div>
      </div>
      {showOverlay && <Overlay width={'w-1/2'}>
        <div>
          <h3>Search for class</h3>
          <SearchBar input={searchInput} setInput={setSearchInput} placeholder="Search for class by level, age, instructor" />
        </div>
        <div className="h-[500px] overflow-y-auto mt-4 flex flex-col gap-y-3">
          {classes.map(classObj => (
            <Class key={classObj._id} classObj={classObj} />
          ))}
        </div>
      </Overlay>}
    </div >
  )
}

export default EditUser;