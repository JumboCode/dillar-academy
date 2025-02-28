import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { postLogin } from "../api/user-wrapper";
import Form from "@/components/Form/Form";
import FormInput from '@/components/Form/FormInput';
import FormSubmit from "../components/Form/FormSubmit";
import Alert from "@/components/Alert";
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
  const [alertData, setAlertData] = useState({ message: "" })

  useEffect(() => {
    if (isSignedIn && user) {
      if (user?.privilege === "admin") {
        setLocation("/admin/levels");
      } else if (user?.privilege === "teacher") {
        setLocation("/teacher")
      } else {
        setLocation("/student")
      }
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
        const dashboardURL = response.data.privilege === "admin" ? "/admin/levels" : `/${response.data.privilege}`;

        setLocation(dashboardURL);
      } else {
        console.log("Failed to sign in through Clerk", JSON.stringify(createUser, null, 2));
      }
    } catch (error) {
      console.error(error)
      setAlertData({ message: "" });
      setTimeout(() => {
        console.log(error.message)
        setAlertData({ message: "Error: " + (error.message || "There was an error during login.") });
      }, 10);
    }
  };

  return (
    <>
      <div className="header-gradient page-format flex justify-center items-center">
        {alertData.message && <Alert message={alertData.message} />}
        <div className="w-full max-w-[96rem] flex justify-center">
          <Form width="lg:w-3/5 xl:w-2/5">
            <h3 className="font-extrabold">{t("login_text")}</h3>
            <p className="text-base sm:text-lg text-gray-500 mt-3 mb-5mt-3 mb-5">{t("login_signup1")}
              <Link href="/signup" className="ml-2 font-extrabold text-blue-400">{t("sign_up_text")}</Link>
            </p>
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
        </div>
      </div >
    </>
  )
}