import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { Globe } from 'lucide-react';
import Dropdown from './Dropdown';

const langMapping = {
  English: "en",
  Русский: "ru",
  中文: "zh",
  Türkçe: "tr",
};

const LanguageDropdown = () => {
  const [selectedLang, setSelectedLang] = useState("English");

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
  };

  return (
    <Dropdown 
      label={
        <div className="flex items-center space-x-1">
          <Globe size={18} className="text-gray-600" />
          <span>{selectedLang}</span>
        </div>
      }
      buttonClassName="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-gray-900 min-w-[90px]"
    >
      {Object.keys(langMapping).map((lang) => (
        <button
          key={lang}
          className={`block w-full text-left px-4 py-2 text-sm ${
            selectedLang === lang ? 'text-blue-500 bg-gray-50' : 'text-gray-700'
          } hover:bg-gray-50`}
          role="menuitem"
          onClick={() => handleSelectLang(lang)}
        >
          {lang}
        </button>
      ))}
    </Dropdown>
  );
};

export default LanguageDropdown;