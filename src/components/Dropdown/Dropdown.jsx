import { useState, useEffect, useRef } from 'react';
import { IoChevronDownOutline } from "react-icons/io5";

const Dropdown = ({ label, children, buttonClassName = "text-right" }) => {
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
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div ref={dropdownRef} className="relative sm:w-auto w-full">
      {/* dropdown button */}
      <button
        className={`box-border flex items-center h-full ${buttonClassName}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {label}
        <IoChevronDownOutline className={`h-4 w-4 text-black transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {/* dropdown */}
      {isOpen && (
        <div className="absolute mt-2 w-full rounded-md shadow-lg bg-white z-50 outline outline-white">
          <div className="py-1 flex flex-col" role="menu" aria-orientation="vertical">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;