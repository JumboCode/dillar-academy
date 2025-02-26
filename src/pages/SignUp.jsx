import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from 'wouter'
import { postUser } from "@/api/user-wrapper";
import Form from "@/components/Form/Form"
import FormInput from "@/components/Form/FormInput";
import FormSubmit from "@/components/Form/FormSubmit";
import PasswordReqs from "@/components/PasswordReqs";
import Alert from "@/components/Alert";
import { useSignUp, useAuth } from '@clerk/clerk-react'
import { UserContext } from '@/contexts/UserContext.jsx';
import { useTranslation } from "react-i18next";

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
    password: '',
    retypedPassword: '',
  })
  const [isValid, setIsValid] = useState(false);
  const [alertData, setAlertData] = useState({ message: "" })

  useEffect(() => {
    if (isSignedIn && user) {
      setLocation(`/${user?.privilege}`);
    }
  }, [isSignedIn, user])

  if (!isLoaded) return;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      // placeholder for possible account verification?

      if (createUser.status === "complete") {
        await setActive({ session: createUser.createdSessionId })
        const userData = { ...formData, clerkId: createUser.createdUserId };
        const response = await postUser(userData);
        if (response.status === 201) {
          setUser(response.data);
        } else {
          // TODO
        }
        setLocation(`/${response.data.privilege}`);
      } else {
        console.log("Failed to create Clerk user:", JSON.stringify(createUser, null, 2));
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setAlertData({ message: "" });
        setTimeout(() => {
          setAlertData({ message: "Error: " + (error.message || "There was an error during sign in.") });
        }, 10);
      } else {
        setAlertData({ message: "" });
        setTimeout(() => {
          setAlertData({ message: "Error: " + (error.message || "There was an error during sign in.") });
        }, 10);
      }
    }
  }

  return (
    <div className='header-gradient w-full h-full flex-1 py-10 flex items-center justify-center'>
      {alertData.message && <Alert message={alertData.message} />}
      <Form
        width={"mx-10 w-full sm:w-2/5"}
      >
        <h3 className="font-extrabold">{t("sign_up_text")}</h3>
        <p className="text-base sm:text-lg mt-3 mb-5 text-gray-500">{t("sign_up_login1")}
          <Link className="ml-2 font-extrabold text-blue-500" href="/login">{t("login_text")}</Link>
        </p>
        {/* Form Values and the Borders */}
        <form method="POST" onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-y-3 sm:gap-y-0 sm:gap-x-3 sm:flex-row flex-col">
            <FormInput
              isRequired={true}
              type="text"
              name="firstName"
              value={formData.firstName}
              placeholder={t("f_name_field")}
              onChange={handleChange}
            />
            <FormInput
              isRequired={true}
              type="text"
              name="lastName"
              value={formData.lastName}
              placeholder={t("l_name_field")}
              onChange={handleChange}
            />
          </div>
          <FormInput
            isRequired={true}
            type="email"
            name="email"
            value={formData.email}
            placeholder={t("email_field")}
            onChange={handleChange}
          />
          <FormInput
            isRequired={true}
            type="password"
            name="password"
            value={formData.password}
            placeholder={t("password_field")}
            onChange={handleChange}
          />
          <FormInput
            isRequired={true}
            type="password"
            name="retypedPassword"
            value={formData.retypedPassword}
            placeholder={t("retype_password_field")}
            onChange={handleChange}
          />
          <div className="mt-2">
            <PasswordReqs formData={formData} setIsValid={setIsValid} />
          </div>
          <FormSubmit label={t("sign_up_text")} isDisabled={!isValid} />
        </form>
      </Form>
    </div>
  )
}
