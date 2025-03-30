import { useEffect, useState } from "react";
import { getUsers } from "@/api/user-wrapper";
import { getClassById } from "@/api/class-wrapper";
import { IoPersonOutline } from "react-icons/io5";


const ClassStudents = ({ classID }) => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classID) return;

    const fetchStudents = async () => {
      try {
        setLoading(true);

        const classData = await getClassById(classID);

        const userData = await getUsers();
        if (userData?.data) {
          setStudents(userData.data.filter((user) => user.privilege === "student" && classData.roster.includes(user._id)));
        } else {
          setStudents([]);
        }
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [classID]);

  if (loading) return <p>Loading students...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (students.length === 0) return <p>No students found.</p>;

  return (
    <div className="space-y-4">
      <div className="text-indigo-900 inline-flex gap-x-2 items-center mt-2">
        <IoPersonOutline />
        <p>{students.length} enrolled</p>
      </div>

      <div className="grid grid-cols-4 gap-4">

        {students.map((student) => (
          <div key={student._id} className="flex py-[12px] px-[16px] justify-between items-center space-x-3 w-full rounded-sm flex-space-between">
            <div className="ml-3">
              <p className="text-gray-900 font-semibold">{student.firstName} {student.lastName}</p>
              <p className="flex text-gray-500 text-sm">{student.email}</p>
            </div>
          </div>
        ))}

      </div>
    </div>

  );
};

export default ClassStudents;
