import { useState } from "react";
import { Link, useLocation } from 'wouter'
import { postUser } from "@/api/user-wrapper";
import PasswordChecklist from "react-password-checklist"
import Form from "@/components/Form/Form"
import FormInput from "@/components/Form/FormInput";
import FormSubmit from "../components/Form/FormSubmit";
import { useSignUp } from '@clerk/clerk-react'

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    retypedPassword: '',
  })
  const [isValid, setIsValid] = useState(false);

  if (!isLoaded) return;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      const { email, password } = formData;
      // create Clerk user
      const createUser = await signUp.create({
        emailAddress: email,
        password: password
      });

      // placeholder for possible account verification?

      if (createUser.status === "complete") {
        await setActive({ session: createUser.createdSessionId });
        console.log(createUser.createdUserId);
        const userData = { ...formData, clerkId: createUser.createdUserId };
        console.log(userData)
        const response = await postUser(userData);
        if (response.status === 201) {
          // alert('User created successfully!');
          console.log('User created successfully!')
        }
        setLocation("/")
      } else {
        console.log("Failed to create Clerk user:", JSON.stringify(createUser, null, 2));
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // alert('User already exists.');
        console.log('User already exists.')
      } else {
        // alert('An error occurred while creating the user.')
        console.log('An error occurred while creating the user', error)
      }
    }
  }

  return (
    <div className='bg-blue-200 h-full py-8 flex items-center justify-center'>
      <Form
        width={"w-2/5"}
      >
        <h3 className="text-3xl">Sign up</h3>
        <p className="my-3 text-gray-500">Already have an account?
          <Link className="ml-1 font-extrabold text-blue-400" href="/login">Log In</Link>
        </p>
        {/* Form Values and the Borders */}
        <form method="POST" onSubmit={handleSubmit} className="space-y-3">
          <div className="flex space-y-3 sm:space-y-0 sm:space-x-3 sm:flex-row flex-col">
            <FormInput
              isRequired={true}
              type="text"
              name="firstName"
              value={formData.firstName}
              placeholder="First Name"
              onChange={handleChange}
            />
            <FormInput
              isRequired={true}
              type="text"
              name="lastName"
              value={formData.lastName}
              placeholder="Last Name"
              onChange={handleChange}
            />
          </div>
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
          <FormSubmit label={"Sign Up"} isDisabled={!isValid} />
        </form>
      </Form>
    </div>
  )
}
