import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { postLogin } from "../api/user-wrapper";
import Form from "@/components/Form/Form";
import FormInput from '@/components/Form/FormInput';
import FormSubmit from "../components/Form/FormSubmit";
import { useSignIn, useAuth } from "@clerk/clerk-react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useTranslation } from "react-i18next";

export default function Login() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [, setLocation] = useLocation();
  const { isSignedIn } = useAuth();
  const { user, setUser } = useContext(UserContext);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    if (isSignedIn && user) {
      setLocation(`/${user?.privilege}`);
    }
  }, [isSignedIn, user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      const { email, password } = formData;
      const userLogin = await signIn.create({
        identifier: email,
        password: password
      })

      if (userLogin.status === "complete") {
        await setActive({ session: userLogin.createdSessionId });
        const response = await postLogin(formData);
        if (response.status === 200) {
          setUser(response.data)
        } else {
          // TODO
        }
        setLocation(`/${response.data.privilege}`);
      } else {
        console.log("Failed to sign in through Clerk", JSON.stringify(createUser, null, 2));
      }
    } catch (error) {
      console.error('Error during login: ', error);
      alert("An error occurred during login.");
    }
  };

  return (
    <>
      <main className="bg-blue-200 h-full flex justify-center items-center p-10">
        <Form width="w-8/9 sm:w-3/5 l:w-1/2">
          <h1 className="text-2xl sm:text-3xl">{t("login_text")}</h1>
          <h3 className="text-sm sm:text-base text-slate-400 my-3">{t("login_signup1")}
            <Link href="/signup" className="ml-1 font-extrabold text-blue-400">{t("sign_up_text")}</Link>
          </h3>
          <form method="POST"
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <FormInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("username_field")}
              isRequired={true} />
            <FormInput
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t("password_field")}
              isRequired={true} />
            <p className="text-sm flex justify-end text-black opacity-50"><Link href="/forgotpassword">{t("forgot_pass")}</Link></p>
            <FormSubmit label={t("login_text")} />
          </form >
        </Form >
      </main >
    </>
  )
}