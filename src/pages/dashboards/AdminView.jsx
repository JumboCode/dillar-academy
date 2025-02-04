import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getUser } from '@/api/user-wrapper';
import Form from '@/components/Form/Form';
import FormInput from '@/components/Form/FormInput';
import { enrollInClass } from '@/api/class-wrapper';
import EnrollButton from "@/components/Button/EnrollButton";

const AdminView = () => {
  const { user, } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [email, setEmail] = useState("");
  const [classId, setClassId] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        setAllowRender(true);
      }
    }
  }, [isLoaded, isSignedIn, user]);

  if (!allowRender) {
    return <div></div>
  }

  if (user?.privilege !== "admin") {
    return <div>Unauthorized</div>
  }


  const handleEnrollment = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Fetch student's email
      const response = await getUser(`email=${email}`);
      const student = response.data; // response?.data

      // Validate if the user is a student or exists at all
      if (!student || student.privilege !== "student") {
        throw new Error("User is not a student or does not exist");
      }

      const studentId = student._id;

      // Check if the student is already enrolled in the class
      if (student.enrolledClasses.includes(classId)) {
        throw new Error("Student is already enrolled in this class");
      }

      // Enroll student in the class
      const enrollmentResponse = await enrollInClass(classId, studentId);

      if (!enrollmentResponse.ok) {
        throw new Error("Failed to enroll student");
      }

      setSuccess("Student successfully enrolled to class");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-full">
      <h1>Admin</h1>
      <Form width="w-1/2">
        <form onSubmit={ handleEnrollment }>
          <FormInput type="email" name="email" placeholder="Student Email" value={null} onChange={(e) => setEmail(e.target.value)} />
          <FormInput type="text" name="classId" placeholder="Class ID" value={null} onChange={(e) => setClassId(e.target.value)} />
          <EnrollButton userId={email} classId={classId} isEnroll={true} />
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </Form>
    </div>
  );
};

export default AdminView;