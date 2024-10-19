
import React, { useState } from 'react';

export default function Contact( ){

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    // Create a message with form inputs
    const alertMessage = `
      Name: ${formData.name}
      Email: ${formData.email}
      Subject: ${formData.subject}
      Message: ${formData.message}
    `;
  
    // Show the alert with the form data
    alert(alertMessage);
  
    console.log('Form submitted:', formData);
  };
  

  return (
    <div style={{ fontFamily: 'Roboto, sans-serif' }} className="min-h-screen bg-white flex justify-center items-center">
      <div className="w-full lg:flex lg:space-x-0">
        
        {/* Contact Info Section */}
        <div className="lg:w-1/3 bg-white p-8 flex flex-col justify-center items-start">
          <h2 className="text-3xl font-semibold mb-6 text-left">CONTACT US</h2>
          <p className="mb-2 text-lg text-left">
            Email: 
            <a href="mailto:dillarenglish@gmail.com" className="text-black">
              dillarenglish@gmail.com
            </a>
          </p>
          <p className="text-lg text-left">
            Instagram: 
            <a href="https://www.instagram.com/dillarenglish" className="text-black">
              @dillarenglish
            </a>
          </p>
        </div>
  
        {/* Form Section - Make this full width */}
        <div className="lg:w-2/3 bg-blue-200 p-10">
          {/* Form container with max width */}
          <div className="bg-white p-6 shadow-lg rounded-lg max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-2">Get in Touch</h2>
            <p className="mb-4 text-gray-600" style={{ opacity: 0.7 }}>
                Let us know if you have questions or concerns.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-500"
                required
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-500"
                required
              />
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 h-32 placeholder-gray-500"
                required
              />
              <button
                type="submit"
                className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}




