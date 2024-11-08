import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({ selectedLang, onSelectLang }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (lang) => {
    onSelectLang(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-gray-900 min-w-[90px]"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span>{selectedLang}</span>
        <svg 
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {["English", "Русский", "中文", "Türkçe"].map((lang) => (
              <button
                key={lang}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={() => handleSelect(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  selectedLang: PropTypes.string.isRequired,
  onSelectLang: PropTypes.func.isRequired,
};

export default Dropdown;
