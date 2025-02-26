import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useSignIn } from "@clerk/clerk-react";
import Form from "@/components/Form/Form";
import FormInput from "@/components/Form/FormInput";
import FormSubmit from "@/components/Form/FormSubmit";
import { useTranslation } from "react-i18next";

export default function ResetPasswordCode() {
  const { t } = useTranslation();
  const { isLoaded, signIn } = useSignIn();
  const [, setLocation] = useLocation();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);

  // Ensure the email is stored; if not, redirect back
  useEffect(() => {
    const email = sessionStorage.getItem("reset_password_email");
    if (!email) {
      setLocation("/forgotpassword");
    }
  }, [setLocation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || retryAfter > 0) return;
    setIsSubmitting(true);
    setError("");

    try {
      // Attempt to verify the code with Clerk
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
      });
      if (result.status === "needs_new_password") {
        // Save the code for the next step
        sessionStorage.setItem("reset_password_code", code);
        setLocation("/reset-password");
      } else {
        setError("Invalid code. Please check your email and try again.");
      }
    } catch (err) {
      if (err.response?.status === 429) {
        const retryAfterSecs = parseInt(err.response.headers["retry-after"]) || 30;
        setRetryAfter(retryAfterSecs);
        setError(`Too many attempts. Please wait ${retryAfterSecs} seconds.`);
        const timer = setInterval(() => {
          setRetryAfter((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(err.errors?.[0]?.longMessage || "An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <main className="header-gradient h-full py-10 sm:py-32 flex justify-center items-center">
      <Form width="w-4/5 px-5 sm:px-12 lg:w-2/5">
        <h1 className="text-2xl sm:text-3xl font-semibold my-3">{t("enter_reset_code")}</h1>
        <p className="text-sm text-gray-600 mb-4">{t("reset_code_instructions")}</p>
        <form onSubmit={handleSubmit} className="gap-y-3">
          <FormInput
            type="text"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t("reset_code_placeholder")}
            isRequired={true}
            disabled={isSubmitting || retryAfter > 0}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <FormSubmit
            label={isSubmitting ? t("verifying") : t("verify_code")}
            isDisabled={isSubmitting || retryAfter > 0}
          />
          {retryAfter > 0 && <p className="text-sm text-gray-600 mt-2">You can try again in {retryAfter} seconds</p>}
        </form>
      </Form>
    </main>
  );
}
