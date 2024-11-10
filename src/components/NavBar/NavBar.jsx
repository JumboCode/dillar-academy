import { useState } from 'react';
import { Link } from 'wouter';
import dillarLogo from '/dillar_logo.png';
import NavLink from './NavLink';
import LanguageDropdown from '../Dropdown/Dropdown_Language';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo section */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <img className="h-8 w-auto" src={dillarLogo} alt="Dillar English Academy" />
          </Link>

          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <NavLink href="/about">About</NavLink>
            <NavLink href="/courses">Courses</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <NavLink href="/login" className="text-blue-500">Login</NavLink>
            
            <div className="h-6 w-px bg-gray-300 self-center"></div>
            
            <LanguageDropdown />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div id="mobile-menu" className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <NavLink href="/about" isMobile={true}>About</NavLink>
          <NavLink href="/contact" isMobile={true}>Contact</NavLink>
          <NavLink href="/courses" isMobile={true}>Courses</NavLink>
          <NavLink href="/login" isMobile={true}>Login</NavLink>
          <LanguageDropdown />
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
