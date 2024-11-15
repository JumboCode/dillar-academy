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
      <main className="bg-blue-200 h-full flex justify-center items-center">
        <Form width="w-2/5">
          <h1 className="text-2xl sm:text-3xl">Login</h1>
          <h3 className="text-sm sm:text-base text-slate-400 my-3">Don't have an account?
            <Link href="/signup" className="ml-1 font-bold text-blue-400">Sign up</Link>
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

            <FormSubmit label={"Login"} />
          </form>
        </Form>
      </main>
    </>
  )
}