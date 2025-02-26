import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { updateUser, getUser } from '@/api/user-wrapper.js'
import FormInput from '@/components/Form/FormInput'
import Button from '@/components/Button/Button';

const EditStudent = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);

  const params = useParams();
  const [student, setStudent] = useState(null);
  const [studentFormData, setStudentFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        setAllowRender(true);
      }
    }

    fetchStudent();
  }, [isLoaded, isSignedIn, user]);

  const fetchStudent = async () => {
    try {
      const userFilter = new URLSearchParams(`_id=${params.id}`);
      const studentData = await getUser(userFilter);
      setStudent(studentData.data);
      setStudentFormData({
        firstName: studentData.data.firstName,
        lastName: studentData.data.lastName,
        email: studentData.data.email,
        password: studentData.data.password
      });
    } catch (error) {
      console.error('Error fetching student:', error);
    }
  }

  const handleUserInputChange = (e) => {
    setStudentFormData({ ...studentFormData, [e.target.name]: e.target.value });
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(params.id, studentFormData);
      setStudentFormData({ firstName: '', lastName: '', email: '', password: '' })
      await fetchStudent();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!allowRender || !student) {
    return <div></div>;
  }

  if (user?.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="h-full flex-1 p-8 space-y-10">
      <h3 className="font-extrabold">Edit Student</h3>
      <form onSubmit={handleEditUser} className="space-y-4">
        <FormInput
          type="text"
          name="firstName"
          placeholder="First Name"
          value={studentFormData.firstName}
          onChange={handleUserInputChange}
          isRequired={true}
        />
        <FormInput
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={studentFormData.lastName}
          onChange={handleUserInputChange}
          isRequired={true}
        />
        <FormInput
          type="email"
          name="email"
          placeholder="Email"
          value={studentFormData.email}
          onChange={handleUserInputChange}
          isRequired={true}
        />
        <FormInput
          type="text"
          name="password"
          placeholder="Password"
          value={studentFormData.password}
          onChange={handleUserInputChange}
          isRequired={false}
        />
        <div className="flex justify-end space-x-2">
          <Button label="Save" type="submit" />
        </div>
      </form>
    </div>
  )
}

export default EditStudent;