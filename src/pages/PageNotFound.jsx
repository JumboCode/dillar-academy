
import { useLocation } from 'wouter';
import Button from '../components/Button/Button';
import { useTranslation } from "react-i18next";


const PageNotFound = () => {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();


  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-6xl mb-2 font-bold pt-5 py-5" >{t("page_not_found_text")}</h1>
      <h2 className="text-3xl mb-2 font-normal"> {t("page_not_found_desc")}</h2>
      <div className='flex space-x-5 whitespace-nowrap pt-8'>
        <Button
          label={t("return_home_text")}
          onClick={() => setLocation("/")}
          isOutline={false}
        />
        <Button
          label={t("get_help_text")}
          onClick={() => setLocation("/")}
          isOutline={true}
        />
      </div>
    </div>
  )
}

export default PageNotFound;