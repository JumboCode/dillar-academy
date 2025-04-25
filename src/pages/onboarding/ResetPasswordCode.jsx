import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useSignIn } from "@clerk/clerk-react";
import Form from "@/components/Form/Form";
import FormInput from "@/components/Form/FormInput";
import Button from "@/components/Button/Button";
import { useTranslation } from "react-i18next";

const ResetPasswordCode = () => {
  const { t } = useTranslation();
  const { isLoaded, signIn } = useSignIn();
  const [, setLocation] = useLocation();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);
  const [resendMessage, setResendMessage] = useState("");

  // Ensure the email is stored; if not, redirect back
  useEffect(() => {
    const email = sessionStorage.getItem("reset_password_email");
    if (!email) {
      setLocation("/forgot-password");
    }
  }, [setLocation]);

  const handleResendCode = async () => {
    const email = sessionStorage.getItem("reset_password_email");
    if (!email) return;

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setResendMessage("reset_code_resent_success", "Resent Code Success");
    } catch (err) {
      console.error("Resend error:", err);
      setResendMessage("reset_code_resent_failed", "Resent Code Failed");
    }
  };

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
        setError('invalid_code_error');
      }
    } catch (err) { // TODO: check that error and retry attempt works
      if (err.response?.status === 429) {
        const retryAfterSecs = parseInt(err.response.headers["retry-after"]) || 30;
        setRetryAfter(retryAfterSecs);
        setError('too_many_attempts_wait_sec');
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
        setError(err.errors?.[0]?.longMessage || 'error_occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <main className="header-gradient page-format flex justify-center items-center">
      <div className="w-full max-w-[96rem] flex justify-center">
        <Form width="lg:w-3/5 xl:w-2/5">
          <h1 className="font-extrabold mb-3">{t("enter_reset_code")}</h1>
          <p className="text-base sm:text-lg text-gray-600 mb-5">{t("enter_reset_code_desc")}</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <FormInput
              type="text"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t("reset_code")}
              isRequired={true}
              disabled={isSubmitting || retryAfter > 0}
            />
            {error && <p className="text-red-500 text-sm mt-2">{t(error, { sec: retryAfter })}</p>}
            <div className="flex flex-col space-y-3">
              <Button
                type="submit"
                label={t("verify_code")}
                isDisabled={isSubmitting || retryAfter > 0}
              />
              <Button
                type="button"
                label={t("resend_code", "Resend Code")}
                onClick={handleResendCode}
                isDisabled={isSubmitting || retryAfter > 0}
                isOutline={true}
              />
            </div>
            {resendMessage && (
              <p className="text-green-600 text-sm text-center mt-2">{t(resendMessage)}</p>
            )}
          </form>
        </Form>
      </div>
    </main>
  );
}

export default ResetPasswordCode;