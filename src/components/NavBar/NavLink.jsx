import { Link, useLocation } from 'wouter';

const NavLink = ({ href, isMobile, onClick, children }) => {
  const [location] = useLocation();

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`font-normal text-base ${(location == href || location.startsWith(href + "/")) ? "text-blue-700 hover:text-blue-400" : "text-black hover:text-neutral-300"} ${isMobile ? "block py-2 px-3 border-l-4 border-transparent" : "px-3 py-2"}`}
    >
      {children}
    </Link>
  )
};

export default NavLink;