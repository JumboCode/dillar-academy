import { useState } from "react";
import { resetPassword } from "../api/user-wrapper";
import PasswordChecklist from "react-password-checklist"
import Form from "@/components/Form/Form";
import FormInput from '@/components/Form/FormInput';
import FormSubmit from "../components/Form/FormSubmit";

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
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    retypedPassword: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [isValid, setIsValid] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, retypedPassword } = formData
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
          <h1 className="text-4xl font-semibold my-3">Forgot Your Password?</h1>

          <form method="POST"
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <FormInput
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              isRequired={true} />

            <FormInput
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New Password"
              isRequired={true} />

            <FormInput
              type="password"
              name="retypedPassword"
              value={formData.retypedPassword}
              onChange={handleChange}
              placeholder="Retype New Password"
              isRequired={true} />

            <div className="mt-2">
              <PasswordChecklist
                rules={[
                  "minLength",
                  "capitalAndLowercase",
                  "number",
                  "specialChar",
                  "match"
                ]}
                minLength={10}
                value={formData.password}
                valueAgain={formData.retypedPassword}
                onChange={(isValid) => setIsValid(isValid)}
              />
            </div>

            <FormSubmit label={"Reset Password"} isDisabled={!isValid} />
          </form>
        </Form>
      </main>
    </>
  )
}