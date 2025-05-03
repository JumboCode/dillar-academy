import 'react-phone-number-input/style.css';
import './style.css';
import ReactPhoneInput from 'react-phone-number-input';

const PhoneInput = ({ name, value, setValue }) => {
  const styles = "text-base sm:text-lg w-full py-3 px-4 border border-gray-400 rounded-sm placeholder-gray-500";

  return (
    <ReactPhoneInput
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