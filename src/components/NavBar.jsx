import React, { useState } from 'react';
import dillarLogo from '../images/dillar_logo.png';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand name */}
          <a href="/" className="flex-shrink-0 flex items-center">
            <img className="h-8 w-auto" src={dillarLogo} alt="Dillar English Academy" />
            <span className="ml-2 text-xl font-normal text-gray-800">DILLAR ENGLISH ACADEMY</span>
          </a>

          {/* Desktop navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <NavLink href="#courses">Courses</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/login">Login</NavLink>
            <LanguageSelector />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <MobileNavLink href="#courses">Courses</MobileNavLink>
          <MobileNavLink href="/about">About</MobileNavLink>
          <MobileNavLink href="/contact">Contact</MobileNavLink>
          <MobileNavLink href="/login">Login</MobileNavLink>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <LanguageSelector mobile />
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ href, children }) => (
  <a
    href={href}
    className="text-gray-500 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
  >
    {children}
  </a>
);

const MobileNavLink = ({ href, children }) => (
  <a
    href={href}
    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition duration-150 ease-in-out"
  >
    {children}
  </a>
);

const LanguageSelector = ({ mobile }) => (
  <div className={`relative ${mobile ? '' : ''}`}>
    <button
      type="button"
      className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
      id="language-menu"
      aria-haspopup="true"
    >
      <span className="sr-only">Open language menu</span>
      <span>English</span>
      <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  </div>
);

export default NavBar;