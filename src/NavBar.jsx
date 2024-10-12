import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <Link to="/" className="text-xl font-bold" aria-label="Home">
        <img src="/path-to-your-logo.png" alt="Logo" className="h-8" />
      </Link>
      <div className="flex space-x-4">
        <Link to="/about" className="hover:text-gray-300">About</Link>
        <Link to="/contact" className="hover:text-gray-300">Contact</Link>
      </div>
    </nav>
  );
};

export default NavBar;
