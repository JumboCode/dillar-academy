import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/contexts/UserContext.jsx";
import { useLocation } from "wouter";
import { useAuth } from "@clerk/clerk-react";
import { getClasses } from "@/api/class-wrapper.js";
import Class from "@/components/Class/Class";
import { Link } from "wouter";


const TeacherView = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const teacherClasses = await getClasses(`instructor=${user.firstName}`);
        setClasses(teacherClasses);
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

  if (!allowRender) {
    return;
  }

  if (user.privilege !== "teacher") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="page-format max-w-[96rem]">
      <h1 className="text-3xl font-bold mb-4">
        Welcome {`${toTitleCase(user.firstName)} ${toTitleCase(user.lastName)}`}!
      </h1>
        <section>
        <h1 className='text-3xl mb-4'> Your courses </h1>
        <div className='grid grid-cols-3 gap-6'>
          {classes.map((classObj, classIndex) => (
            <Class key={classIndex} classObj={classObj} modes={["unenroll"]} />
          ))}n
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
        </section>
    </div>
  );
};


export default TeacherView;
