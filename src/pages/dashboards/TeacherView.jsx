import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react'
import { updateUser, getUser } from '@/api/user-wrapper';
import { getClassById, getStudentsClasses } from '@/api/class-wrapper';
import { Link } from "wouter"
import { FaRegEdit } from "react-icons/fa";
import Button from '@/components/Button/Button';
import { GiH2O } from "react-icons/gi";

const TeacherView = () => {
    const { user, } = useContext(UserContext);
    const [, setLocation] = useLocation();
    const { isSignedIn, isLoaded } = useAuth();
    const [allowRender, setAllowRender] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      age: '',
      gender: '',
    });
  
    useEffect(() => {
        if (isLoaded) {
            if (!isSignedIn) {
                setLocation("/login");
            } else {
                setAllowRender(true);
            }
        }
    }, [isLoaded, isSignedIn, user]);

    const fetchUser = async () => {
        const userFilter = new URLSearchParams(`_id=${user._id}`);
        const response = await getUser(userFilter);
        setUser(response.data);
    }

    const handleEditInfo = async (e) => {
        e.preventDefault();
        try {
          await updateUser(user._id, formData);
          await fetchUser();
          setShowEditModal(false);
          setFormData({ firstName: '', lastName: '', email: '', age: '', gender: '' });
        } catch (error) {
          console.error('Error updating data:', error);
        }
      };
    
      const openEditTeacher = () => {
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          age: user.age || '',
          gender: user.gender || '',
        });
        setShowEditModal(true);
      };
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      };

    const toTitleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);

    if (!allowRender) {
        return;
    }

    if (user?.privilege !== "teacher") {
        return <div>Unauthorized</div>
    }

    return (
        <div className="page-format">
            <br></br>
                <h3 className='font-extrabold mb-2'>
                    {`${toTitleCase(user.firstName)} ${toTitleCase(user.lastName)}`}
                </h3>
                <button className="flex"
                    onClick={() => openEditTeacher()}>
                    <FaRegEdit className="mr-1 fill-neutral-400 mt-1" />
                    <p className="text-neutral-400">Edit Profile</p>
                </button>

                <p className="mt-5">
                    <span className="text-black">Email</span>{" "}
                    <span className="text-neutral-500 ml-2">{user.email}</span>
                </p>

                <h4 className='font-extrabold mb-4 mt-8'>
                    Class Schedule
                </h4>

        </div>
    );
};

export default TeacherView;
