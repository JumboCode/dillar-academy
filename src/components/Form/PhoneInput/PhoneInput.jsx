import 'react-phone-number-input/style.css';
import './style.css';
import ReactPhoneInput from 'react-phone-number-input'
import { useTranslation } from 'react-i18next'

const PhoneInput = ({ name, value, setValue }) => {
  const { t } = useTranslation();
  const styles = "text-base sm:text-lg w-full py-3 px-4 border border-gray-400 rounded-sm placeholder-gray-500";

  return (
    <ReactPhoneInput
      placeholder={t('enter_phone_number')}
      value={value || '+'}
      onChange={(phone) =>
        setValue({ target: { name, value: phone || '' } })
      }
      international
      className={styles}
    />
  )
}

export default PhoneInput;