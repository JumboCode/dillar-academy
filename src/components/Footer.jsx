import { useTranslation } from "react-i18next";
import { Link } from "wouter";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="h-60 lg:h-80 bg-blue-700 text-white flex flex-col justify-center items-center gap-y-3 sm:gap-y-5">
      <div className="max-w-[96rem] w-full px-4 sm:px-6 lg:px-20 flex flex-col gap-y-3 sm:gap-y-5">
        <h1 className="font-extrabold">Dillar Academy</h1>
        <p className="lg:text-lg">{t("email_field")}: dillarenglish@gmail.com</p>
        <p className="lg:text-lg">{t("instagram")}: @dillaracademy</p>
        <Link href="/contact" className={"lg:text-lg"}>Contact Us</Link>
      </div>
    </footer>
  )
}

export default Footer;