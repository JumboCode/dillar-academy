import { useState } from "react";
import { Link } from "wouter";
import { postLogin } from "../api/user-wrapper";
import Form from "@/components/Form/Form";
import FormInput from '@/components/Form/FormInput';
import FormSubmit from "../components/Form/FormSubmit";

//Fetching first

const getUserPassword = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/users/password')
      const jsonData = await response.json() // Converting data to json
      return jsonData
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
      <main className="bg-gradient-to-tr from-blue-100 to-blue-500 h-full flex justify-center items-center">
        <Form width="w-1/3 h-3/5">
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
              placeholder="Password"
              isRequired={true} />             

            <FormSubmit label={"Reset Password"} />
          </form>
        </Form>
      </main>
    </>
  )
}