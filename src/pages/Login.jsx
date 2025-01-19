import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { postLogin } from "../api/user-wrapper";
import Form from "@/components/Form/Form";
import FormInput from '@/components/Form/FormInput';
import FormSubmit from "../components/Form/FormSubmit";
import { useSignIn, useAuth } from "@clerk/clerk-react";
import { UserContext } from '@/contexts/UserContext.jsx';

export default function Login() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [, setLocation] = useLocation();
  const { isSignedIn } = useAuth();
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    console.log(user)
    if (isSignedIn && user) {
      setLocation(`/${user?.privilege}`);
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
        console.log(response)
        if (response.status === 200) {
          console.log(response.data)
          setUser(response.data)
        } else {
          // TODO
        }
        setLocation(`/${response.data.privilege}`);
      } else {
        console.log("Failed to sign in through Clerk", JSON.stringify(createUser, null, 2));
      }

      // const response = await postLogin(formData)
      // if (response.ok) {
      //   const data = await response.json();
      //   console.log(data.message);
      //   const userQuery = `?firstName=${encodeURIComponent(data.user.firstName)}&lastName=${encodeURIComponent(data.user.lastName)}&email=${encodeURIComponent(data.user.email)}`;
      //   if (data.user.privilege) {
      //     setLocation(`/admin${userQuery}`);
      //   } else {
      //     setLocation(`/student${userQuery}`);
      //   }
      // } else {
      //   const errorMessage = await response.text();
      //   console.error(errorMessage);
      //   alert("Login failed: " + errorMessage);
      // }
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
            <Link href="/signup" className="ml-1 font-extrabold text-blue-400">Sign up</Link>
          </h3>
          <form method="POST"
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <FormInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
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