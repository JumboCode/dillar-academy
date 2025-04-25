import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { postLogin } from "../../api/user-wrapper";
import Form from "@/components/Form/Form";
import FormInput from '@/components/Form/FormInput';
import Button from "@/components/Button/Button";
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
  const [alertMessage, setAlertMessage] = useState("")

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
        }
        const dashboardURL = response.data.privilege === "admin" ? "/admin/levels" : `/${response.data.privilege}`;

        setLocation(dashboardURL);
      } else {
        console.log("Failed to sign in through Clerk", JSON.stringify(createUser, null, 2));
        setAlertMessage(`Error: ${JSON.stringify(createUser, null, 2)}`); // TODO: translation
        setTimeout(() => {
          setAlertMessage("");
        }, 4000)
      }
    } catch (error) {
      setAlertMessage(`Error: ${error.response.data.message}`); // TODO: translation
      setTimeout(() => {
        setAlertMessage("");
      }, 4000)
    }
  };

  return (
    <>
      {alertMessage && <Alert message={alertMessage} />}
      <div className="header-gradient page-format flex justify-center items-center">
        <div className="w-full max-w-[96rem] flex justify-center">
          <Form width="lg:w-3/5 xl:w-2/5">
            <h1 className="font-extrabold">{t("login")}</h1>
            <div className="flex gap-x-2 text-base sm:text-lg mt-3 mb-5">
              <p className="text-gray-500">{t("dont_have_account")}</p>
              <Link href="/signup" className="font-extrabold text-blue-400">{t("sign_up")}</Link>
            </div>
            <form method="POST"
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              <FormInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("email")}
                isRequired={true} />
              <FormInput
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t("password")}
                isRequired={true} />
              <Link href="/forgot-password" className="text-sm flex justify-end text-black opacity-50">{t("forgot_password")}</Link>
              <Button
                type="submit"
                label={t("login")}
              />
            </form >
          </Form >
        </div>
      </div >
    </>
  )
}