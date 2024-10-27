import { useState } from "react";
import { Link } from 'wouter'

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '', 
    email: '',
    password: '',
    retypedPassword: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, password, retypedPassword } = formData
    if (password != retypedPassword) {
      alert(`Passwords do not match:\npassword: ${password}\nretyped password: ${retypedPassword}`)
    } else {
      alert(`Form submitted with\nusername: ${username}\nemail: ${email}\npassword: ${password}\nretyped password: ${retypedPassword}`)
    }
  }

  return (
    <div className='bg-blue-200 h-screen flex items-center justify-center'>
      <div id="signup" className="shadow-2xl w-2/5 h-fit bg-white rounded-xl py-10">
        <div>
          <h3 className="text-3xl ml-10"> Sign up </h3>
          <p className="mt-8 text-gray-500 ml-10"> Already have an account? 
            <Link className="ml-1 font-bold text-blue-400" href="/Login"> Log In</Link>
          </p>
        </div>

        {/* Form Values and the Borders */}
        <form method="POST" onSubmit={handleSubmit}>
          <input
            required
            type="name"
            name="name"
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
          <button
            type='submit'
            className="ml-10 mt-6 px-6 py-2 items-center bg-gray-300 tracking-wide text-lg rounded-lg"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  )
}
