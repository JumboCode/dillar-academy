import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import dillarLogo from '/dillar_logo.png';
import NavLink from './NavLink';
import i18next from 'i18next';
import Dropdown from '../Dropdown/Dropdown';
import { Globe } from 'lucide-react';


const langMapping = {
  English: "en",
  Русский: "ru",
  中文: "zh",
  Türkçe: "tr",
};


const NavBar = () => {
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [selectedLang, setSelectedLang] = useState("English");
 const [isDropdownOpen, setIsDropdownOpen] = useState(false);


 useEffect(() => {
   const savedLang = localStorage.getItem("language");
   if (savedLang) {
     const langName = Object.keys(langMapping).find(key => langMapping[key] === savedLang);
     setSelectedLang(langName || "English");
     i18next.changeLanguage(savedLang);
   }
 }, []);


 const handleSelectLang = (langName) => {
   const langCode = langMapping[langName];
   i18next.changeLanguage(langCode);
   setSelectedLang(langName);
   localStorage.setItem("language", langCode);
   setIsDropdownOpen(false);
 };


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
          
           <div className="relative">
             <button
               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
               className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-gray-900"
               style={{ minWidth: '100px' }}
             >
               <Globe size={18} className="text-gray-600" />
               <span>{selectedLang}</span>
               <svg
                 className={`h-4 w-4 text-gray-500 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                 viewBox="0 0 20 20"
                 fill="currentColor"
               >
                 <path
                   fillRule="evenodd"
                   d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                   clipRule="evenodd"
                 />
               </svg>
             </button>


             {/* Dropdown Menu */}
             {isDropdownOpen && (
               <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                 {Object.keys(langMapping).map((lang) => (
                   <button
                     key={lang}
                     onClick={() => handleSelectLang(lang)}
                     className={`block w-full text-left px-4 py-2 text-sm ${
                       selectedLang === lang ? 'text-blue-500 bg-gray-50' : 'text-gray-700'
                     } hover:bg-gray-50`}
                   >
                     {lang}
                   </button>
                 ))}
               </div>
             )}
           </div>
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
         <Dropdown selectedLang={selectedLang} onSelectLang={handleSelectLang} />
       </div>
       <div className="pt-4 pb-3 border-t border-gray-200">
       </div>
     </div>
   </nav>
 );
};


export default NavBar;
