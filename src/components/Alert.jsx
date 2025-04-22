import { useTranslation } from "react-i18next";

const Alert = ({ message, isSuccess }) => {
  const { t } = useTranslation();

  return (
    <div
      className={
        `border-l-4 p-4
        ${isSuccess ? 'bg-green-100 border-green-300' : 'bg-red-100 text-red-800 border-red-300'} 
        rounded-lg fixed top-28 z-30`
      }>
      <p className="sm:text-lg">{t(message)}</p>
    </div>
  );
};

export default Alert;