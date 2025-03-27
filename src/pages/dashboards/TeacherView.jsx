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
    const { user, setUser } = useContext(UserContext);
    const [, setLocation] = useLocation();
    const { isSignedIn, isLoaded } = useAuth();
    const [allowRender, setAllowRender] = useState(false);
  
    useEffect(() => {
        if (isLoaded) {
            if (!isSignedIn) {
                setLocation("/login");
            } else {
                setAllowRender(true);
                fetchUser();

            }
        }

    }, [isLoaded, isSignedIn, user]);

    const fetchUser = async () => {
        const userFilter = new URLSearchParams(`_id=${user._id}`);
        const response = await getUser(userFilter);
        setUser(response.data);
      }

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
                    onClick={() => setLocation(`/teacher/edit/${encodeURIComponent(user._id)}`)}>
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
