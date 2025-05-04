import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getClassById } from "@/wrapper/class-wrapper";
import FormInput from '@/components/Form/FormInput'
import Button from '@/components/Button/Button';
import { updateClass } from '@/wrapper/class-wrapper.js';
import { getUser } from '@/wrapper/user-wrapper.js';
import BackButton from "@/components/Button/BackButton";
import UserItem from "@/components/UserItem";
import SkeletonUser from "@/components/Skeletons/SkeletonUser";
import useDelayedSkeleton from '@/hooks/useDelayedSkeleton';
import Unauthorized from "@/pages/Unauthorized";

const InstructorEditClass = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);

  const params = useParams();
  const [link, setLink] = useState('');
  const [students, setStudents] = useState([]);
  const showSkeleton = useDelayedSkeleton(!allowRender);

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
      setLink(data.link || '');
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
    setLink(e.target.value);
  };

  const handleEditClass = async (e) => {
    e.preventDefault();
    try {
      await updateClass(params.id, { link });
      await fetchClass();
      setLocation("/instructor")
    } catch (error) {
      console.error('Error updating class:', error);
    }
  }

  if (user && user.privilege !== "instructor") {
    return <Unauthorized />;
  }

  return (
    <div className="page-format max-w-[96rem] space-y-10">
      <BackButton label={"Dashboard"} href={"/instructor"} />
      <div>
        <h1 className="font-extrabold mb-1">Edit Class</h1>
        <p className="sm:text-lg">Edit class and student information</p>
      </div>

      <form onSubmit={handleEditClass}>
        <div className="flex justify-start space-x-10 w-full lg:w-2/3 mb-6">
          <div className="w-full space-y-3">
            <label className="mx-1">Google Classroom Link</label>
            <FormInput
              type="text"
              name="link"
              placeholder="Google Classroom Link"
              value={link}
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
          {allowRender
            ? students.map((student) => (
              <UserItem key={student._id} userData={student} />
            ))
            : showSkeleton && <SkeletonUser count={3} />}
        </div>
      </div>
    </div>
  )
}

export default InstructorEditClass;