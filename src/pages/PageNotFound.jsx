
import { useLocation } from 'wouter';
import Button from '../components/Button/Button';
import { useTranslation } from "react-i18next";


const PageNotFound = () => {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();


  return (
    <div className="w-full h-full flex-1 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl md:text-6xl mb-2 mx-2 font-bold pt-5 py-5" >{t("page_not_found_text")}</h1>
      <h5 className="mx-2 font-normal"> {t("page_not_found_desc")}</h5>
      <div className='flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-5 items-center justify-center text-center whitespace-nowrap pt-8'>
        <Button
          label={t("return_home_text")}
          onClick={() => setLocation("/")}
          isOutline={false}
        />
        <Button
          label={t("get_help_text")}
          onClick={() => setLocation("/contact")}
          isOutline={true}
        />
      </div>
    </div>
  )
}

export default PageNotFound;