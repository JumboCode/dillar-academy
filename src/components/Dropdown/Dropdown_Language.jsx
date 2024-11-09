import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from './Dropdown';

const LanguageDropdown = ({ selectedLang, onSelectLang }) => {
  const languages = ["English", "Русский", "中文", "Türkçe"];

  return (
    <Dropdown 
      label="Language"
      selected={selectedLang}
      buttonClassName="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-gray-900 min-w-[90px]"
    >
      {languages.map((lang) => (
        <button
          key={lang}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
          onClick={() => onSelectLang(lang)}
        >
          {lang}
        </button>
      ))}
    </Dropdown>
  );
};

LanguageDropdown.propTypes = {
  selectedLang: PropTypes.string.isRequired,
  onSelectLang: PropTypes.func.isRequired,
};

export default LanguageDropdown;