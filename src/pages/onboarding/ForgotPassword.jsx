import { useState } from "react";
import { useLocation } from "wouter";
import { useSignIn } from "@clerk/clerk-react";
import Form from "@/components/Form/Form";
import FormInput from "@/components/Form/FormInput";
import Button from "@/components/Button/Button";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
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
      sessionStorage.setItem("reset_password_email", email); // Not very foolproof, if entered email for code but never entered code, this will always stay in session storage

      // Initiate the reset password flow via Clerk
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      // Navigate to the code verification page
      setLocation("/reset-password-code");
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || 'error_occurred'); // TODO: first or translation
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <main className="header-gradient page-format flex justify-center items-center">
      <div className="w-full max-w-[96rem] flex justify-center">
        <Form width="lg:w-3/5 xl:w-2/5">
          <h1 className="font-extrabold mb-3">{t("forgot_password")}</h1>
          <p className="text-base sm:text-lg text-gray-600 mb-5">{t("forgot_pass_desc")}</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <FormInput
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("email")}
              isRequired={true}
              disabled={isSubmitting}
              className="mb-4"
            />
            {error && <p className="text-red-500 text-sm mt-2">{t(error)}</p>}
            <Button
              type="submit"
              label={t("submit_button")}
              isDisabled={isSubmitting}
            />
          </form>
        </Form>
      </div>
    </main>
  );
}

export default ForgotPassword;