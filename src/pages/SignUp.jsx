import { useState } from "react";
import { Link } from 'wouter'
import axios from "axios";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '', 
    email: '',
    username: '',
    password: '',
    retypedPassword: ''
  })
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, retypedPassword} = formData
    if (password != retypedPassword) {
      alert(`Passwords do not match:\npassword: ${password}\nretyped password: ${retypedPassword}`)
    } else {
      try {
        // Using environment variable for API URL
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, formData);
        if (response.status === 201) {
          setSuccess('User created successfully!');
          alert('User created successfully!');
          setError('');
        }
      } catch (err) {
        if (err.response && err.response.status === 409) {
          setError('User already exists.');
          alert('User already exists.');
        } else {
          setError('An error occurred while creating the user.');
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
