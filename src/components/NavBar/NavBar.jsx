import { useContext, useRef, useState, useEffect } from 'react';
import { Link } from 'wouter';
import dillarLogo from '/dillar_logo.png';
import NavLink from './NavLink';
import LanguageDropdown from '@/components/Dropdown/LanguageDropdown';
import { IoMenuOutline } from "react-icons/io5";
import { SignOutButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { UserContext } from '../../contexts/UserContext';
import { useTranslation } from "react-i18next";

const NavBar = () => {
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, } = useContext(UserContext)
  const { t } = useTranslation();

  // close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      // exclude menu button
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) &&
        menuButtonRef.current && !menuButtonRef.current.contains(e.target)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div>
      <nav className="w-full fixed top-0 bg-white h-20 shadow-md z-[1000]">
        {/* Navbar content */}
        <div className='flex justify-between items-center px-8 h-full'>
          <Link href="/" className="flex-shrink-0 flex items-center">
            <img className="h-14 w-auto" src={dillarLogo} alt="Dillar Academy" />
          </Link>
          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-10 xl:gap-x-20">
            {user?.privilege === "admin" ? <>
              <NavLink href="/admin/levels">Classes</NavLink>
              <NavLink href="/admin/students">Students</NavLink>
              <NavLink href="/admin/instructors">Instructors</NavLink>
              <NavLink href="/admin/schedule">Schedule</NavLink>
              <NavLink href="/admin/translations">Translations</NavLink>
            </> : <>
              <NavLink href="/levels">{t("classes")}</NavLink>
              <NavLink href="/contact">{t("contact")}</NavLink>
              <NavLink href="/about">{t("about")}</NavLink>
              <SignedOut>
                <NavLink href="/login">{t("login")}</NavLink>
              </SignedOut>
              <SignedIn>
                <NavLink href={`/${user?.privilege}`}>{t("dashboard")}</NavLink>
              </SignedIn>
            </>}
          </div>
          <div className='hidden lg:flex lg:items-center'>
            <SignedIn>
              <SignOutButton className="hover:text-neutral-300 px-3 py-2">
                {t("sign_out")}
              </SignOutButton>
            </SignedIn>
            <LanguageDropdown />
          </div>
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center p-2 
            rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 
            focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            ref={menuButtonRef}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">Open main menu</span>
            <IoMenuOutline size={32} color='black' />
          </button>
        </div>
        {/* Mobile menu */}
        <div ref={mobileMenuRef} className={`lg:hidden flex flex-col items-center w-full pb-4 shadow-md bg-white ${isMenuOpen ? 'block' : 'hidden'}`}>
          {user?.privilege === "admin" ? <>
            <NavLink href="/admin/levels" isMobile={true} onClick={closeMenu}>Classes</NavLink>
            <NavLink href="/admin/students" isMobile={true} onClick={closeMenu}>Students</NavLink>
            <NavLink href="/admin/instructors" isMobile={true} onClick={closeMenu}>Instructors</NavLink>
            <NavLink href="/admin/schedule" isMobile={true} onClick={closeMenu}>Schedule</NavLink>
            <NavLink href="/admin/translations" isMobile={true} onClick={closeMenu}>Translations</NavLink>
            <SignOutButton className="py-2 px-3" />
            <div className="w-full h-2 mt-2 mx-3 border-t border-gray-200"></div>
            <LanguageDropdown />
          </> : <><NavLink href="/levels" isMobile={true} onClick={closeMenu}>{t("classes")}</NavLink>
            <NavLink href="/contact" isMobile={true} onClick={closeMenu}>{t("contact")}</NavLink>
            <NavLink href="/about" isMobile={true} onClick={closeMenu}>{t("about")}</NavLink>
            <SignedOut>
              <NavLink href="/login" isMobile={true} onClick={closeMenu}>{t("login")}</NavLink>
            </SignedOut>
            <SignedIn>
              <NavLink href={`/${user?.privilege}`} onClick={closeMenu}>{t("dashboard")}</NavLink>
              <SignOutButton className="py-2 px-3" />
            </SignedIn>
            <div className="w-full h-2 mt-2 mx-3 border-t border-gray-200"></div>
            <LanguageDropdown />
          </>}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
