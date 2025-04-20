import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useSignIn, useClerk } from "@clerk/clerk-react";
import { resetPassword as updateMongoPassword } from "../../api/user-wrapper";
import Form from "@/components/Form/Form";
import FormInput from "@/components/Form/FormInput";
import Button from "@/components/Button/Button";
import PasswordReqs from "@/components/PasswordReqs";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const { t } = useTranslation();
  const { isLoaded, signIn } = useSignIn();
  const clerk = useClerk();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ password: "", retypedPassword: "" });
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ensure required session data exists; if not, redirect back.
  useEffect(() => {
    const code = sessionStorage.getItem("reset_password_code");
    const email = sessionStorage.getItem("reset_password_email");
    if (!code || !email) {
      setLocation("/forgot-password");
    }
  }, [setLocation]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, retypedPassword } = formData;
    if (password !== retypedPassword) {
      setError("Passwords do not match");
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      const result = await signIn.resetPassword({ password });
      if (result.status === "complete") {
        // Sign the user out using the clerk instance.
        await clerk.signOut();
        // Update the password in MongoDB via your Express endpoint.
        const email = sessionStorage.getItem("reset_password_email");
        const response = await updateMongoPassword({ email, password });
        if (response.success) {
          // Clean up session storage and redirect to the login page.
          sessionStorage.removeItem("reset_password_code");
          sessionStorage.removeItem("reset_password_email");
          setLocation("/login");
        } else {
          setError("Failed to update password in database. Please contact support.");
          console.error("MongoDB update failed:", response.error);
        }
      } else {
        setError("Failed to update password. Please try again.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError(err.errors?.[0]?.longMessage || "An error occurred while resetting the password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <main className="header-gradient page-format flex justify-center items-center">
      <div className="w-full max-w-[96rem] flex justify-center">
        <Form width="lg:w-3/5 xl:w-2/5">
          <h1 className="font-extrabold mb-3">{t("enter_new_password")}</h1>
          <form onSubmit={handleSubmit} className="space-y-3">
            <FormInput
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t("password")}
              isRequired={true}
              disabled={isSubmitting}
            />
            <FormInput
              type="password"
              name="retypedPassword"
              value={formData.retypedPassword}
              onChange={handleChange}
              placeholder={t("reset_password")}
              isRequired={true}
              disabled={isSubmitting}
            />
            <div className="mt-2">
              <PasswordReqs formData={formData} setIsValid={setIsValid} />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <Button
              type="submit"
              label={t("reset_password")}
              isDisabled={!isValid || isSubmitting}
            />
          </form>
        </Form>
      </div>
    </main>
  );
}

export default ResetPassword;