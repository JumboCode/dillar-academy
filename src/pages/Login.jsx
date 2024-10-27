import { useState } from "react";
import { Link } from "wouter";

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
        const { username, password } = formData;
        // alert(`Form submitted with\nusername: ${username}\nand password: ${password}`)

        try { 
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const message = await response.text();
                console.log(message);
                alert("Login successful");
            } else {
                const errorMessage = await response.text();
                console.error(errorMessage);
                alert("Login failed: " + errorMessage);
            }
        } catch (error) {
            console.error('Error during login: ', error);
            alert("An error occurred during login");
        }
    };
    
    return (
        <>
            <main className="bg-blue-200 h-screen flex justify-center items-center">
                <div className="bg-white w-2/3 md:1/2 lg:w-2/5 py-16 px-5 sm:px-20 rounded-lg shadow-2xl min-h-min">
                    <h1 className="text-2xl sm:text-3xl mb-3">Login</h1>
                    <h3 className="text-sm sm:text-base text-slate-400 mb-6">Don't have an account?
                        <Link href="/SignUp" className="text-blue-400"> Sign up</Link> 
                    </h3>

                    <form method="POST" onSubmit={handleSubmit}>
                        <input type="text"
                        id="Username" 
                        name="username" 
                        defaultValue={formData.username} 
                        onChange={handleChange} 
                        className="my-4 border border-gray-500 rounded-md block w-full p-2 sm:p-2.5 text-sm sm:text-base placeholder-gray-500" 
                        placeholder="Username" required/>

                        <input type="password" 
                        id="Password" 
                        name="password" 
                        defaultValue={formData.password} 
                        onChange={handleChange} 
                        className="my-4 border border-gray-500 rounded-md block w-full p-2 sm:p-2.5 text-sm md:text-base placeholder-gray-500" 
                        placeholder="Password" required/>
                        
                        <button className="bg-gray-200 py-2 px-4 rounded-md my-2 text-sm sm:text-base" type="submit">Login</button>
                    </form>
                </div>
            </main>
        </>
    )
}