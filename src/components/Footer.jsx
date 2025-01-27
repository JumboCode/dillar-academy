import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="h-80 px-10 bg-dark-blue-800 text-white flex flex-col justify-center gap-y-5">
      <p className="text-2xl  lg:text-4xl font-extrabold">Dillar English Academy</p>
      <p className="text-l lg:text-lg">{t("email_field")}: dillarenglish@gmail.com</p>
      <p className="text-l lg:text-lg">{t("instagram")}: @dillaracademy</p>
    </footer>
  )
}

export default Footer;