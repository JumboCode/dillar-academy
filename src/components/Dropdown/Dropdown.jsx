import { useState, useEffect, useRef } from 'react';
import { IoChevronDownOutline } from "react-icons/io5";

const Dropdown = ({ label, children, buttonClassName = "dropdown-button text-right" }) => {
  const dropdownRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false);

  // close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      // unbind event listener when dropdown is closed
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div ref={dropdownRef} className="relative">
      {/* dropdown button */}
      <button
        className={buttonClassName}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {label}
        <IoChevronDownOutline className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {/* dropdown */}
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