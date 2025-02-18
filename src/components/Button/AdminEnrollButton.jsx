import { useState } from "react";
import Button from "@/components/Button/Button";
import { adminEnrollStudent } from "../../api/class-wrapper";

const AdminEnrollButton = ({ email, classId }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleEnrollment = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log(`📡 Enrolling student: ${email} into Class ID: ${classId}`);
      
      if (!email || !classId) {
        throw new Error("Both email and class ID are required.");
      }

      const responseMessage = await adminEnrollStudent(email, classId);
      console.log(`✅ Enrollment successful: ${responseMessage}`);

      setSuccess("Student successfully enrolled!");
    } catch (err) {
      console.error("❌ Enrollment error:", err);
      setError(err.message || "Error enrolling student.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button 
        label={loading ? "Processing..." : "Enroll Student"} 
        isOutline={false} 
        onClick={handleEnrollment} 
        disabled={loading}
      />
      {success && <p className="text-green-500 mt-2">{success}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default AdminEnrollButton;
