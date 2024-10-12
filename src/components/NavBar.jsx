import React from 'react';

// import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <img src="dillar-academy/src/images/dillar_logo.png" alt="" />
      <div className="flex space-x-4">
        <a href="dillar-academy/src/pages/Contact.jsx">Contact</a>
        <a href="/Users/clairelee/Desktop/tufts/2024-2025/dillar-academy/dillar-a-test/dillar-academy/src/pages/About.jsx">About</a>
        <a href="dillar-academy/src/pages/Login.jsx">Login</a>
      </div>
    </nav>
  );
};

export default NavBar;
