
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
    e.preventDefault();
    console.log('Form submitted', formData);
    // You can add API logic here for the form submission
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="max-w-4xl w-full mx-4 lg:flex lg:space-x-10">
        {/* Contact Info */}
        <div className="lg:w-1/3 mb-10 lg:mb-0">
          <h2 className="text-3xl font-bold mb-6">CONTACT US</h2>
          <p className="mb-2 text-lg">Email: <a href="mailto:dillarenglish@gmail.com" className="text-blue-500">dillarenglish@gmail.com</a></p>
          <p className="text-lg">Instagram: <a href="https://www.instagram.com/dillarenglish" className="text-blue-500">@dillarenglish</a></p>
        </div>

        {/* Form */}
        <div className="lg:w-2/3 bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Get in Touch</h2>
          <p className="mb-6 text-gray-600">Let us know if you have questions or concerns.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
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
  );
}



    
