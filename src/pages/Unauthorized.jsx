
import { useLocation } from 'wouter';
import Button from '../components/Button/Button';
import { useTranslation } from "react-i18next";

const Unauthorized = () => {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  return (
    <div className='page-format flex flex-col items-center justify-center text-center'>
      <h1 className='text-4xl sm:text-5xl font-extrabold mb-2 mx-2 py-5'>{t('unauthorized')}</h1>
      <h3 className='mx-2'>{t('unauthorized_desc')}</h3>
      <div className='grid grid-cols-1 w-full sm:w-auto sm:grid-cols-2 space-y-3 sm:space-y-0 sm:space-x-5 items-center justify-center text-center whitespace-nowrap pt-8'>
        <Button
          label={t("return_home")}
          onClick={() => setLocation("/")}
          isOutline={false}
        />
        <Button
          label={t("get_help")}
          onClick={() => setLocation("/contact")}
          isOutline={true}
        />
      </div>
    </div>
  )
}

export default Unauthorized
