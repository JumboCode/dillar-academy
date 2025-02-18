import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getUser } from '@/api/user-wrapper.js';
import { getClasses } from '@/api/class-wrapper.js';

const AdminView = () => {
    const { user, } = useContext(UserContext);
    const [, setLocation] = useLocation();
    const { isSignedIn, isLoaded } = useAuth();
    const [allowRender, setAllowRender] = useState(false);
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState({});


    useEffect(() => {
        if (isLoaded) {
            if (!isSignedIn) {
                setLocation("/login");
            } else {
                setAllowRender(true);
            }
        }
        
        // const fetchClassesandStudents = async() =>{
        //     if(user){
        //         //getting teacher calsses
        //         const teacherClasses = await getClasses(`instructor=${user._id}`);
        //         setClasses(teacherClasses);

        //         //getting the kids 
        //         const studentsData = {};
        //         for(const class of teacherClasses){
        //             studentsData[class._id] = await Promise.all(
        //                 class.enrolledStudents.map(studentID => getUser(`_id=${studentID}`)));
        //         }
        //         setStudents(studentsData);

        //     }
        // }

    }, [isLoaded, isSignedIn, user]);


    if (!allowRender) {
        return;
    }

    if (user?.privilege !== "teacher") {
        return <div>Unauthorized</div>
    }

    return (
        <div className="h-full">
            <h1>Teacher</h1>
            {/* Make endpoint to edit GCal Link */}
            {/* Get Classes wrapper (query string of teachers) “instructor={instructor_name}”
            / Get Users wrappers (takes in student ID and get the user object which we display)“_id:{student_ID}”. 
            */}
            {/* Format: Classes -> All students/emails */}
            {/* <section>
                <h1 className='text-3xl mb-4'> Your courses </h1>
                <div className='grid grid-cols-3 gap-6'>
                    {classes.map((classObj, classIndex) => (
                        <Class key={classIndex} classObj={classObj} />
                    ))}
                    <div className="flex items-center">
                        <Link
                            to="/levels"
                            className="ml-4 w-12 h-12 bg-blue-500 text-white text-3xl 
            font-bold rounded-full shadow-md flex items-center justify-center
            hover:bg-blue-600 transition"
                        >
                            +
                        </Link>
                    </div>
                </div>
            </section> */}
        </div>
    );
};

export default AdminView;
