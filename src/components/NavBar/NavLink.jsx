import { Link, useLocation } from 'wouter';

const NavLink = ({ href, isMobile, children }) => {
  const [location] = useLocation();

  return (
    <Link
      href={href}
      className={`font-normal text-base ${location == href ? "text-blue-700 hover:text-blue-400" : "text-black hover:text-neutral-300"} ${isMobile ? "block pl-3 pr-4 py-2 border-l-4 border-transparent" : "px-3 py-2 rounded-md"}`}
    >
      {children}
    </Link>
  )
};

export default NavLink