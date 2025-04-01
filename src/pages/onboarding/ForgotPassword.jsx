import { useState } from "react";
import { useLocation } from "wouter";
import { useSignIn } from "@clerk/clerk-react";
import Form from "@/components/Form/Form";
import FormInput from "@/components/Form/FormInput";
import FormSubmit from "@/components/Form/FormSubmit";
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const { isLoaded, signIn } = useSignIn();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      // Save the email for later steps
      sessionStorage.setItem("reset_password_email", email);

      // Initiate the reset password flow via Clerk
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      // Navigate to the code verification page
      setLocation("/reset-password-code");
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <main className="header-gradient page-format flex justify-center items-center">
      <div className="w-full max-w-[96rem] flex justify-center">
        <Form width="lg:w-3/5 xl:w-2/5">
          <h1 className="font-extrabold mb-3">Forgot Password</h1>
          <p className="text-base sm:text-lg text-gray-600 mb-5">Enter your email below for password reset instructions.</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <FormInput
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={"Email"}
              isRequired={true}
              disabled={isSubmitting}
              className="mb-4"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <FormSubmit label={isSubmitting ? t("Sending") : t("Send")} isDisabled={isSubmitting} />
          </form>
        </Form>
      </div>
    </main>
  );
}