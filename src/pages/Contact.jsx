
import { useState } from 'react';
import { postContact } from '@/api/contact-wrapper';

export default function Contact() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postContact(formData)

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json()
      console.log(json)
      alert("Inquiry submitted successfully!")

    } catch (err) {
      console.error(error.message)
      alert("There was an error submitting the inquiry.")
    }
  };


  return (
    <div className="w-full h-full bg-white flex flex-col sm:flex-row justify-center items-center">
      <div className="sm:w-1/3 w-full p-8">
        <h2 className="text-3xl font-semibold mb-6">CONTACT US</h2>
        <p className="mb-2 text-lg">
          Email:
          <a href="mailto:dillarenglish@gmail.com" className="text-black">
            dillarenglish@gmail.com
          </a>
        </p>
        <p className="text-lg">
          Instagram:
          <a href="https://www.instagram.com/dillarenglish" className="text-black">
            @dillarenglish
          </a>
        </p>
      </div>

      <div className="sm:w-2/3 w-full bg-blue-200 p-10">
        {/* form box */}
        <div className="bg-white p-6 shadow-lg rounded-lg max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-2">Get in Touch</h2>
          <p className="mb-4 text-gray-600 opacity-70">
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
  );
}




