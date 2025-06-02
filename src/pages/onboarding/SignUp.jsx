import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from 'wouter'
import { postUser } from "@/wrappers/user-wrapper";
import Form from "@/components/Form/Form"
import FormInput from "@/components/Form/FormInput";
import PhoneInput from "@/components/Form/PhoneInput/PhoneInput";
import Button from "@/components/Button/Button";
import PasswordReqs from "@/components/PasswordReqs";
import Alert from "@/components/Alert";
import { useSignUp, useAuth } from '@clerk/clerk-react'
import { UserContext } from '@/contexts/UserContext.jsx';
import { useTranslation } from "react-i18next";
import { isPossiblePhoneNumber } from 'react-phone-number-input';

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [, setLocation] = useLocation();
  const { isSignedIn } = useAuth();
  const { user, setUser } = useContext(UserContext)
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    password: '',
    retypedPassword: '',
  })
  const [isValid, setIsValid] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (isSignedIn && user) {
      if (user.privilege === "admin") {
        setLocation("/admin/levels");
      } else if (user.privilege === "instructor") {
        setLocation("/instructor")
      } else {
        setLocation("/student")
      }
    }
  }, [isSignedIn, user])

  if (!isLoaded) return;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      const { email, password } = formData;
      // create Clerk user
      const createUser = await signUp.create({
        emailAddress: email,
        password: password
      });

      if (createUser.status === "complete") {
        await setActive({ session: createUser.createdSessionId })
        const userData = { ...formData, clerkId: createUser.createdUserId };
        const response = await postUser(userData);
        if (response.status === 201) {
          setUser(response.data);
        }
        setLocation(`/${response.data.privilege}`);
      } else {
        console.log("Failed to create Clerk user:", JSON.stringify(createUser, null, 2));
        setAlertMessage(`Error: ${JSON.stringify(createUser, null, 2)}`); // TODO: translation
        setTimeout(() => {
          setAlertMessage("");
        }, 4000)
      }
    } catch (error) {
      console.log(error)
      setAlertMessage(`Error: ${error.message ?? error?.response?.data?.message ?? "Failed to sign up"}`);
      setTimeout(() => {
        setAlertMessage("");
      }, 4000)
    }
  }

  return (
    <>
      {alertMessage && <Alert message={alertMessage} />}
      <div className='header-gradient page-format flex items-center justify-center'>
        <div className="w-full max-w-[96rem] flex justify-center">
          <Form
            width={"lg:w-3/5 xl:w-2/5"}
          >
            <h1 className="font-extrabold">{t("sign_up")}</h1>
            <div className="flex flex-col md:flex-row gap-x-2 text-base sm:text-lg mt-3 mb-5">
              <p className="text-gray-500">{t("already_have_account")}</p>
              <Link className="font-extrabold text-blue-400" href="/login">{t("login")}</Link>
            </div>
            {/* Form Values and the Borders */}
            <form method="POST" onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-y-3 sm:gap-y-0 sm:gap-x-3 sm:flex-row flex-col">
                <FormInput
                  isRequired={true}
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  placeholder={t("first_name")}
                  onChange={handleChange}
                />
                <FormInput
                  isRequired={true}
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  placeholder={t("last_name")}
                  onChange={handleChange}
                />
              </div>
              <FormInput
                isRequired={true}
                type="email"
                name="email"
                value={formData.email}
                placeholder={t("email")}
                onChange={handleChange}
              />
              <PhoneInput
                name="whatsapp"
                value={formData.whatsapp}
                setValue={handleChange}
              />
              <FormInput
                isRequired={true}
                type="password"
                name="password"
                value={formData.password}
                placeholder={t("password")}
                onChange={handleChange}
              />
              <FormInput
                isRequired={true}
                type="password"
                name="retypedPassword"
                value={formData.retypedPassword}
                placeholder={t("retype_password")}
                onChange={handleChange}
              />
              <div className="mt-2">
                <PasswordReqs formData={formData} setIsValid={setIsValid} />
              </div>
              <Button
                type="submit"
                label={t("sign_up")}
                isDisabled={!isValid}
              />
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
