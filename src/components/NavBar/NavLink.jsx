import { Link } from 'wouter';

const NavLink = ({ href, isMobile, children }) => (
  <Link
    href={href}
    className={`font-normal text-black text-base ${isMobile ? "block pl-3 pr-4 py-2 border-l-4 border-transparent hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition duration-150 ease-in-out" : "hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md transition duration-150 ease-in-out"}`}
  >
    {children}
  </Link>
);

export default NavLink