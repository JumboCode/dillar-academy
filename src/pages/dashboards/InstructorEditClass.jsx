import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getClassById } from "@/api/class-wrapper";
import FormInput from '@/components/Form/FormInput'
import Button from '@/components/Button/Button';
import { updateClass } from '@/api/class-wrapper.js';
import { getUser } from '@/api/user-wrapper.js';
import BackButton from "@/components/Button/BackButton";
import UserItem from "@/components/UserItem";

const InstructorEditClass = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);

  const params = useParams();
  const [classObj, setClassObj] = useState(null);
  const [classroomLink, setClassroomLink] = useState('');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (!params.id) {
      setLocation(`/instructor`);
    }
    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        fetchClass();
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const fetchClass = async () => {
    try {
      const data = await getClassById(params.id);
      setClassObj(data);
      setClassroomLink(data.classroomLink || '');
      const students = await Promise.all(
        data.roster.map(async (studentId) => {
          const studentRes = await getUser(`_id=${studentId}`);
          return studentRes.data
        })
      );
      setStudents(students);
      setAllowRender(true);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleInputChange = (e) => {
    setClassroomLink(e.target.value);
    console.log(classroomLink)
  };

  const handleEditClass = async (e) => {
    e.preventDefault();
    try {
      await updateClass(params.id, { classroomLink });
      await fetchClass();
      setLocation("/instructor")
    } catch (error) {
      console.error('Error updating class:', error);
    }
  }

  if (!allowRender || !classObj) {
    return <div></div>;
  }

  if (user.privilege !== "instructor") {
    return <div>Unauthorized</div>;
  }

  return (

    <div className="page-format max-w-[96rem] space-y-8">
      <BackButton label={"Dashboard"} href={"/instructor"} />
      <div>
        <h1 className="font-extrabold mb-1">Edit Class</h1>
        <p className="sm:text-lg">Edit class and student information</p>
      </div>

      <form onSubmit={handleEditClass}>
        <div className="flex justify-start space-x-10 w-2/3 mb-6">
          <div className="w-2/3 space-y-3">
            <label className="mx-1">Google Classroom Link</label>
            <FormInput
              type="text"
              name="classroomLink"
              placeholder="Google Classroom Link"
              value={classroomLink}
              onChange={handleInputChange}
              isRequired={true}
            />
          </div>
        </div>
        <div className="mt-8">
          <Button label="Save" type="submit" />
        </div>
      </form>

      <div>
        <h2 className="font-extrabold mb-2">Enrolled Students</h2>
        <div className="grid md:grid-cols-3 gap-x-14">
          {students.map((student) => (
            <UserItem key={student._id} userData={student} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default InstructorEditClass;