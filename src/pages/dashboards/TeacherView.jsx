import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/contexts/UserContext.jsx";
import { useLocation } from "wouter";
import { useAuth } from "@clerk/clerk-react";
import { getUser } from "@/api/user-wrapper.js";
import { getClasses } from "@/api/class-wrapper.js";
import Class from "../../components/Class";

const TeacherView = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState({});

  useEffect(() => {
    if (!isLoaded) return;  // Ensure authentication is fully loaded first

    if (!isSignedIn) {
      setLocation("/login");
      return;
    }

    // Ensure user is defined before proceeding
    if (!user) return;

    setAllowRender(true);

    const fetchClassesAndStudents = async () => {
      try {
        console.log("here")
        const teacherClasses = await getClasses(`instructor=${user.firstName}`);
        setClasses(teacherClasses);

        let studentsData = [];
        console.log(teacherClasses)
        for (const cls of teacherClasses) {
          const promises = await Promise.all(cls.roster.map(async (studentID) => {
            const student = await getUser(`_id=${studentID}`);
            console.log(student)
            return student.data;

          }));
          studentsData.concat(promises)

        }

        setStudents(studentsData);
        console.log(students)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchClassesAndStudents();
  }, [isLoaded, isSignedIn, user]); // Depend on user

  // **Ensure user is fully loaded before rendering**
  if (!user) {
    return <div>Loading...</div>;
  }

  if (user.privilege !== "teacher") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="h-full">
      <h1 className="text-3xl font-bold mb-4">Your Courses</h1>
      <div className="grid grid-cols-3 gap-6">
        {classes.map((classObj) => (
          <Class key={classObj._id} classObj={classObj} students={students[classObj._id] || []} />

        ))}
      </div>
    </div>
  );
};

export default TeacherView;