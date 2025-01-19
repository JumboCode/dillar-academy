import { useContext, useState } from 'react';
import { Link } from 'wouter';
import dillarLogo from '/dillar_logo.png';
import NavLink from './NavLink';
import LanguageDropdown from '../Dropdown/LanguageDropdown';
import { IoMenuOutline } from "react-icons/io5";
import { SignOutButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { UserContext } from '../../contexts/UserContext';
import { useTranslation } from "react-i18next";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, } = useContext(UserContext)
  const { t } = useTranslation();

  return (
    <div>
      <nav className="w-full fixed top-0 bg-white h-20 shadow-md ">
        {/* Navbar content */}
        <div className='flex justify-between items-center sm:px-8 px-3 h-full'>
          <Link href="/" className="flex-shrink-0 flex items-center">
            <img className="h-14 w-auto" src={dillarLogo} alt="Dillar English Academy" />
          </Link>
          {/* Desktop navigation */}
          <div className="hidden sm:flex sm:items-center lg:space-x-20 md:space-x-10">
            <NavLink href="/levels">{t("nav_link_classes")}</NavLink>
            <NavLink href="/contact">{t("nav_link_contact")}</NavLink>
            <NavLink href="/about">{t("nav_link_about")}</NavLink>
            <SignedOut>
              <NavLink href="/login">{t("nav_link_login")}</NavLink>
            </SignedOut>
            <SignedIn>
              <SignOutButton />
              <NavLink href={`/${user?.privilege}`}>{t("nav_link_dashboard")}</NavLink>
            </SignedIn>
          </div>
          <div className='hidden sm:inline'>
            <LanguageDropdown />
          </div>
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden inline-flex items-center justify-center p-2 
            rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 
            focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">Open main menu</span>
            <IoMenuOutline size={32} color='black' />
          </button>
        </div>
        {/* Mobile menu */}
        <div className={`sm:hidden flex flex-col items-center w-full pb-3 shadow-md bg-white ${isMenuOpen ? 'block' : 'hidden'}`}>
          <NavLink href="/levels" isMobile={true}>{t("nav_link_classes")}</NavLink>
          <NavLink href="/contact" isMobile={true}>{t("nav_link_contact")}</NavLink>
          <NavLink href="/about" isMobile={true}>{t("nav_link_about")}</NavLink>
          <SignedOut>
            <NavLink href="/login" isMobile={true}>{t("nav_link_login")}</NavLink>
          </SignedOut>
          <SignedIn>
            <div className='py-2'>
              <SignOutButton />
            </div>
            <NavLink href={`/${user?.privilege}`}>{t("nav_link_dashboard")}</NavLink>
          </SignedIn>
          <div className="w-full h-2 mt-2 mx-3 border-t border-gray-200"></div>
          <LanguageDropdown />
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
