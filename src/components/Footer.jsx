import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="h-80 bg-dark-blue-800 text-white flex flex-col justify-center gap-y-5">
            <p className="text-4xl font-extrabold mx-20">{t("home_title")}</p>
            <p className="text-lg mx-20">{t("email_field")}: dillarenglish@gmail.com</p>
            <p className="text-lg mx-20">{t("instagram")}: @dillaracademy</p>
        </footer>
    )
}

export default Footer;