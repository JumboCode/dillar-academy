import { useState } from "react";
import { Link } from 'wouter'
import { postUser } from "@/api/user-wrapper";
import PasswordChecklist from "react-password-checklist"
import Form from "@/components/Form/Form"
import FormInput from "@/components/Form/FormInput";
import FormSubmit from "../components/Form/FormSubmit";

export default function SignUp() {
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
    <div className='bg-[radial-gradient(circle_at_-2.34%_126.57%,rgba(255,255,255,0.8)_0%,rgba(211,237,252,0.8)_35.46%,rgba(178,224,250,0.8)_57.09%,rgba(138,199,244,0.8)_76.71%,rgba(63,150,234,0.8)_100%)] 
                    h-full py-8 flex items-center justify-center'>
      <Form
        width={"w-2/5"}
      >
        <h3 className="text-4xl font-semibold">Sign up</h3>
        <p className="mt-3 mb-5 text-gray-500">Already have an account?
          <Link className="ml-2 font-extrabold text-blue-500" href="/login">Log In</Link>
        </p>

        {/* Form Values and the Borders */}
        <form method="POST" onSubmit={handleSubmit} className="space-y-3">
          <FormInput
            isRequired={true}
            type="text"
            name="username"
            value={formData.username}
            placeholder="Username"
            onChange={handleChange}
          />
          <FormInput
            isRequired={true}
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
          />
          <FormInput
            isRequired={true}
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
          />
          <FormInput
            isRequired={true}
            type="password"
            name="retypedPassword"
            value={formData.retypedPassword}
            placeholder="Retype Password"
            onChange={handleChange}
          />
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
          <p className="text-xs flex justify-end text-black opacity-50"><Link href="/forgotpassword">Forgot password?</Link></p>
          
          <FormSubmit label={"Sign Up"} isDisabled={!isValid} />
        </form>
      </Form>
    </div>
  )
}
