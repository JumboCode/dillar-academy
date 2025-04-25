
import LanguageDropdown from '../components/Dropdown/LanguageDropdown';
import { Link, useLocation } from 'wouter';
import { useTranslation } from "react-i18next";
import { useEffect } from 'react';

const Welcome = ({ onComplete }) => {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleLanguageChange = () => {
      onComplete();
    };

    i18n.on("languageChanged", handleLanguageChange)

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n, setLocation])

  return (
    <div className="header-gradient page-format flex items-center justify-center">
      <div className="text-center mb-12 mt-12 px-5">
        <h1 className="font-extrabold text-4xl sm:text-5xl mb-4">Dillar Academy</h1>
        <p className="mb-8 text-lg">{t("welcome_purpose")}</p>
        <div className="flex flex-col items-center gap-y-4 mb-6">
          {/* Language Dropdown with border */}
          <div className="w-full max-w-xs border border-dark-blue-800 rounded-lg bg-white">
            <LanguageDropdown className="w-full px-4 py-3 text-lg" />
          </div>
          {/* Start Learning Button */}
          <button
            className="w-full max-w-xs px-4 py-3 text-lg font-extrabold text-white bg-dark-blue-800 rounded-lg hover:bg-dark-blue-700"
            onClick={() => {
              onComplete();
              setLocation("/");
            }}
          >
            {t("home_welcome_start")}
          </button>
        </div>
        {/* Login Link */}
        <p className="text-blue-500 hover:underline">
          <Link href="/login" onClick={onComplete}>
            {t("already_have_account")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Welcome;