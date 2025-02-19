import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="h-60 lg:h-80 px-10 bg-blue-600 text-white flex flex-col justify-center gap-y-3 sm:gap-y-5">
      <h3 className="font-extrabold">Dillar English Academy</h3>
      <p className="lg:text-lg">{t("email_field")}: dillarenglish@gmail.com</p>
      <p className="lg:text-lg">{t("instagram")}: @dillaracademy</p>
    </footer>
  )
}

export default Footer;