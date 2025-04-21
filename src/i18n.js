import i18n from "i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",

    ns: ["default", "levels"],
    defaultNS: "default",

    supportedLngs: ["en", "ug", "ru", "tr", "zh"],

    backend: {
      loadPath: "/api/locales/{{lng}}/{{ns}}"
    }
  })

export default i18n;