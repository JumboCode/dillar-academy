import { useState } from 'react';
import { IoChevronDownOutline } from "react-icons/io5";

const Dropdown = ({ label, children, buttonClassName = "dropdown-button text-right" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className={buttonClassName}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {label}
        <IoChevronDownOutline className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;