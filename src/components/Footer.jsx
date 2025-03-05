import { useTranslation } from "react-i18next";
import { Link } from "wouter";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="h-60 lg:h-80 bg-blue-600 text-white flex flex-col justify-center items-center gap-y-3 sm:gap-y-5">
      <div className="max-w-[96rem] w-full px-4 sm:px-6 lg:px-20 space-y-3 sm:space-y-5">
        <h3 className="font-extrabold">Dillar Academy</h3>
        <p className="lg:text-lg">{t("email_field")}: dillarenglish@gmail.com</p>
        <p className="lg:text-lg">{t("instagram")}: @dillaracademy</p>
        <Link href="/contact">Contact Us</Link>
      </div>
    </footer>
  )
}

export default Footer;