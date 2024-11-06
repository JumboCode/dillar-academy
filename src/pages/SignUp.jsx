import { useState } from "react";
import { Link } from 'wouter'
import { postUser } from "@/api/user-wrapper";
import PasswordChecklist from "react-password-checklist"

// TODO (Spencer & Madline): Add password requirements and visual feedback
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
    <div className='bg-blue-200 h-screen flex items-center justify-center'>
      <div id="signup" className="shadow-2xl w-2/5 h-fit bg-white rounded-xl py-10">
        <div>
          <h3 className="text-3xl ml-10"> Sign up </h3>
          <p className="mt-8 text-gray-500 ml-10"> Already have an account?
            <Link className="ml-1 font-bold text-blue-400" href="/login"> Log In</Link>
          </p>
        </div>

        {/* Form Values and the Borders */}
        <form method="POST" onSubmit={handleSubmit}>
          <input
            required
            type="text"
            name="firstName"
            placeholder="First Name"
            className="mt-2 w-10/12 ml-10 p-3 text-lg border-2 border-black border-opacity-20 h-10 rounded-lg"
            onChange={handleChange}
          />
          <input
            required
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="mt-2 w-10/12 ml-10 p-3 text-lg border-2 border-black border-opacity-20 h-10 rounded-lg"
            onChange={handleChange}
          />
          <input
            required
            type="text"
            name="username"
            placeholder="Username"
            className="mt-2 w-10/12 ml-10 p-3 text-lg border-2 border-black border-opacity-20 h-10 rounded-lg"
            onChange={handleChange}
          />
          <input
            required
            type="email"
            name="email"
            placeholder="Email"
            className="mt-2 w-10/12 ml-10 p-3 text-lg border-2 border-black border-opacity-20 h-10 rounded-lg"
            onChange={handleChange}
          />
          <input
            required
            type="password"
            name="password"
            placeholder="Password"
            className="mt-2 w-10/12 ml-10 p-3 text-lg border-2 border-black border-opacity-20 h-10 rounded-lg"
            onChange={handleChange}
          />
          <input
            required
            type="password"
            name="retypedPassword"
            placeholder="Retype Password"
            className="mt-2 w-10/12 ml-10 p-3 text-lg border-2 border-black border-opacity-20 h-10 rounded-lg"
            onChange={handleChange}
          />
          <div className="ml-10 mt-2">

            <PasswordChecklist
                  rules={[
                      "minLength",
                      "specialChar",
                      "number",
                      "capital",
                      "match",
                  ]}
                  minLength={10}
                  value={formData.password}
                  valueAgain={formData.retypedPassword}
                  onChange={(isValid) => setIsValid(isValid)}
            />
          </div>
          <button
            type='submit'
            className={`ml-10 mt-6 px-6 py-2 items-center tracking-wide text-lg rounded-lg ${isValid ? 'bg-gray-300' : 'bg-gray-200 cursor-not-allowed'}`}
            disabled={!isValid}
          >
            
            Sign up
          </button>
            
        </form>
      </div>
    </div>
  )
}
