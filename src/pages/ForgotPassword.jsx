import { useState } from "react";
import { resetPassword } from "../api/user-wrapper";
import Form from "@/components/Form/Form";
import FormInput from '@/components/Form/FormInput';
import FormSubmit from "../components/Form/FormSubmit";
import PasswordReqs from "./PasswordReqs";
import { useTranslation } from "react-i18next";

//Fetching first

const getUserPassword = async () => {
  try {
    const response = await getUserPassword();
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

//Updating the person's password property

// Implement the Welcome page and check for if it should be displayed
export default function ForgotPassword() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    retypedPassword: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [isValid, setIsValid] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, retypedPassword } = formData
    if (password != retypedPassword) {
      alert(`Passwords do not match:\npassword: ${password}\nretyped password: ${retypedPassword}`)
    } else {
      try {
        const response = await resetPassword(formData)

        if (response.ok) {
          const message = await response.text();
          console.log(message);
          alert("Reset successful!");
        } else {
          const errorMessage = await response.text();
          console.error(errorMessage);
          alert("Reset failed: " + errorMessage);
        }
      } catch (error) {
        alert('An error occurred while resetting the password.')
      }
    }
  };

  return (
    <>
      <main className="header-gradient h-full flex justify-center items-center">
        <Form width="w-2/5">
          <h1 className="text-4xl font-extrabold my-3">{t("forgot_your_pass")}</h1>

          <form method="POST"
            onSubmit={handleSubmit}
            className="gap-y-3"
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
              placeholder={t("reset_new_pass")}
              isRequired={true} />

            <FormInput
              type="password"
              name="retypedPassword"
              value={formData.retypedPassword}
              onChange={handleChange}
              placeholder={t("reset_retype_pass")}
              isRequired={true} />

            <div className="mt-2">
              <PasswordReqs formData={formData} setIsValid={setIsValid} />
            </div>

            <FormSubmit label={"Reset Password"} isDisabled={!isValid} />
          </form>
        </Form>
      </main>
    </>
  )
}