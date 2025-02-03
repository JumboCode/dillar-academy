import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoGlobeOutline } from "react-icons/io5";
import Dropdown from './Dropdown';

const langMapping = {
  English: "en",
  Русский: "ru",
  中文: "zh",
  Türkçe: "tr",
};

const LanguageDropdown = () => {
  const [selectedLang, setSelectedLang] = useState("Language"); // Default text
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLang = i18n.language;
    if (savedLang) {
      const langName = Object.keys(langMapping).find(key => langMapping[key] === savedLang);
      setSelectedLang(langName || "Language"); // Fallback to "Language" if no match
    }
  }, [i18n.language]);

  const handleSelectLang = (langName) => {
    const langCode = langMapping[langName];
    i18n.changeLanguage(langCode);
    setSelectedLang(langName);
  };

  return (
    <Dropdown
      label={
        <div className="flex items-center justify-center gap-x-1">
          <IoGlobeOutline size={24} className="text-black" />
          <span className="text-center w-full">{selectedLang}</span>
        </div>
      }
      buttonClassName="flex items-center justify-center w-full text-base font-normal text-black min-w-fit px-4 py-2 sm:px-5 sm:py-3 rounded-lg bg-white"
    >
      {/* Dropdown options */}
      {Object.keys(langMapping).map((lang) => (
        <button
          key={lang}
          className={`block w-full text-center px-4 py-2 text-sm ${selectedLang === lang
            ? 'text-blue-500 bg-gray-50'
            : 'text-gray-700'
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