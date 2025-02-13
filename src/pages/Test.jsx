import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { postLogin } from "../api/user-wrapper";
import Form from "@/components/Form/Form";
import FormInput from '@/components/Form/FormInput';
import FormSubmit from "../components/Form/FormSubmit";
import { useSignIn, useAuth } from "@clerk/clerk-react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useTranslation } from "react-i18next";

import Alert from '@/components/Alert';

export default function Login() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [, setLocation] = useLocation();
  const { isSignedIn } = useAuth();
  const { user, setUser } = useContext(UserContext);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    if (isSignedIn && user) {
      setLocation(`/${user?.privilege}`);
    }
  }, [isSignedIn, user])


  return (
    <>
      <main className="header-gradient h-full py-40 flex justify-center items-center">
        <Alert message="tester"></Alert>
        
      </main >
    </>
  )
}