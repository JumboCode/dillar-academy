import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from 'wouter'
import { postUser } from "@/api/user-wrapper";
import Form from "@/components/Form/Form"
import FormInput from "@/components/Form/FormInput";
import FormSubmit from "@/components/Form/FormSubmit";
import PasswordReqs from "./PasswordReqs";
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
    username: '',
    password: '',
    retypedPassword: '',
  })
  const [isValid, setIsValid] = useState(false);

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
        // alert('User already exists.');
        console.log('User already exists.')
      } else {
        // alert('An error occurred while creating the user.')
        console.log('An error occurred while creating the user', error)
      }
    }
  }

  return (
    <div className='header-gradient h-full py-8 flex items-center justify-center'>
      <Form
        width={"w-8/9 mx-10 lg:w-3/5 xl:w-2/5"}
      >
        <h3 className="text-4xl font-semibold">{t("sign_up_text")}</h3>
        <p className="mt-3 mb-5 text-gray-500">{t("sign_up_login1")}
          <Link className="ml-2 font-extrabold text-blue-500" href="/login">{t("login_text")}</Link>
        </p>
        {/* Form Values and the Borders */}
        <form method="POST" onSubmit={handleSubmit} className="space-y-3">
          <div className="flex space-y-3 sm:space-y-0 sm:space-x-3 sm:flex-row flex-col">
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
            type="text"
            name="username"
            value={formData.username}
            placeholder={t("username_field")}
            onChange={handleChange}
          />
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
