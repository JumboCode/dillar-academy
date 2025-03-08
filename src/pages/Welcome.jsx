import Button from '../components/Button/Button';
import LanguageDropdown from '../components/Dropdown/LanguageDropdown';
import { Link, useLocation } from 'wouter';
import { useTranslation } from "react-i18next";

const Welcome = ({ onComplete }) => {
    const { t } = useTranslation();
    const [, setLocation] = useLocation();

    return (
        <div className="header-gradient page-format flex items-center justify-center">
            <div className="text-center mb-12 mt-12 px-5">
                <h1 className="font-extrabold mb-4">Dillar Academy</h1>
                <p className="mb-8 text-lg">{t("home_purpose")}</p>
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
                        {t("home_learn_title")}
                    </button>
                </div>
                {/* Login Link */}
                <p className="text-blue-500 hover:underline">
                    <Link href="/login" onClick={onComplete}>
                        {t("sign_up_login1")}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Welcome;