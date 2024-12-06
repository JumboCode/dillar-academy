import { useState } from "react";
import { Link, useLocation } from "wouter";
import { postLogin } from "../api/user-wrapper";
import Form from "@/components/Form/Form";
import FormInput from '@/components/Form/FormInput';
import FormSubmit from "../components/Form/FormSubmit";
import { useTranslation } from "react-i18next";


// TODO (Spencer & Claire): implement the Welcome page and check for if it should be displayed
export default function Login() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [, setLocation] = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await postLogin(formData)
      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        const userQuery = `?firstName=${encodeURIComponent(data.user.firstName)}&lastName=${encodeURIComponent(data.user.lastName)}&username=${encodeURIComponent(data.user.username)}`;
        if (data.user.isAdmin) {
          setLocation(`/admin${userQuery}`);
        } else {
          setLocation(`/student${userQuery}`);
        }
      } else {
        const errorMessage = await response.text();
        console.error(errorMessage);
        alert("Login failed: " + errorMessage);
      }
    } catch (error) {
      console.error('Error during login: ', error);
      alert("An error occurred during login.");
    }
  };

  return (
    <>
      <main className="bg-blue-200 h-full flex justify-center items-center">
        <Form width="w-2/5">
          <h1 className="text-2xl sm:text-3xl">{t("sign_up_login2")}</h1>
          <h3 className="text-sm sm:text-base text-slate-400 my-3">{t("login_signup1")}
            <Link href="/signup" className="ml-1 font-extrabold text-blue-400">{t("sign_up_text")}</Link>
          </h3>
          <form method="POST"
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <FormInput
              type="text"
              name="username"
              value={formData.username}
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
            <FormSubmit label={t("sign_up_login2")} />
          </form>
        </Form>
      </main>
    </>
  )
}