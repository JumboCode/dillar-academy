import { useState } from "react";
import { Link } from 'wouter'
import { postUser } from "@/api/user-wrapper";
import Form from "@/components/Form/Form"
import FormInput from "@/components/Form/FormInput";
import FormSubmit from "../components/Form/FormSubmit";
import { useTranslation } from "react-i18next";
import PasswordReqs from "./PasswordReqs";

export default function SignUp() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    retypedPassword: ''
  })
  const handleChange = (e) => {
    console.log(formData)
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [isValid, setIsValid] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, retypedPassword } = formData
    if (password != retypedPassword) {
      alert(`Passwords do not match:\npassword: ${password}\nretyped password: ${retypedPassword}`)
    } else {
      try {
        const response = await postUser(formData)
        if (response.status === 201) {
          alert('User created successfully!');
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          alert('User already exists.');
        } else {
          alert('An error occurred while creating the user.')
        }
      }
    }
  }

  return (
    <div className='header-gradient h-full py-8 flex items-center justify-center'>
      <Form
        width={"w-2/5"}
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
