import { useState } from "react";
import { Link } from "wouter";
import { postLogin } from "../api/user-wrapper";
import Form from "@/components/Form/Form";
import FormInput from '@/components/Form/FormInput';
import FormSubmit from "../components/Form/FormSubmit";


// TODO (Spencer & Claire): implement the Welcome page and check for if it should be displayed
export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await postLogin(formData)

      if (response.ok) {
        const message = await response.text();
        console.log(message);
        alert("Login successful!");
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
      <main className="bg-[radial-gradient(circle_at_-2.34%_126.57%,rgba(255,255,255,0.8)_0%,rgba(211,237,252,0.8)_35.46%,rgba(178,224,250,0.8)_57.09%,rgba(138,199,244,0.8)_76.71%,rgba(63,150,234,0.8)_100%)]
                       h-full flex justify-center items-center">
        <Form width="w-1/3 h-3/5">
          <h1 className="text-4xl font-semibold">Login</h1>
          <h3 className="text-lg sm:text-base text-gray-500 mt-3 mb-5">Don't have an account?
            <Link href="/signup" className="ml-2 font-extrabold text-blue-500">Sign up</Link>
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
              placeholder="Username"
              isRequired={true} />

            <FormInput
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              isRequired={true} />

            <p className="text-sm flex justify-end text-black opacity-50"><Link href="/forgotpassword" >Forgot password?</Link></p>

            <FormSubmit label={"Login"} />
          </form>
        </Form>
      </main>
    </>
  )
}