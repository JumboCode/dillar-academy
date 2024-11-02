import { useState } from 'react';
import { Link } from 'wouter';
import dillarLogo from '/dillar_logo.png';
import NavLink from './NavLink';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand name */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <img className="h-8 w-auto" src={dillarLogo} alt="Dillar English Academy" />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <NavLink href="/about" isMobile={false}>About</NavLink>
            <NavLink href="/contact" isMobile={false}>Contact</NavLink>
            <NavLink href="/classes" isMobile={false}>Classes</NavLink>
            <NavLink href="/signup" isMobile={false}>Sign Up</NavLink>
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
            <NavLink href="/about" isMobile={true}>About</NavLink>
            <NavLink href="/contact" isMobile={true}>Contact</NavLink>
            <NavLink href="/classes" isMobile={true}>Classes</NavLink>
            <NavLink href="/signup" isMobile={true}>Sign Up</NavLink>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
        </div>
      </div>
    </nav>
  );
};

export default NavBar;