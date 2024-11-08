import { Link, useRoute } from 'wouter';

const NavLink = ({ href, children, className = '' }) => {
  const [isActive] = useRoute(href);
  
  return (
    <Link href={href} 
      className={`
        ${className}
        text-sm font-medium px-3 py-5
        ${isActive 
          ? 'text-blue-500 border-b-2 border-blue-500' 
          : 'text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'}
        transition-colors duration-200
      `}
    >
      {children}
    </Link>
  );
};

export default NavLink