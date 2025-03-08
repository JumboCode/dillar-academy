import { IoChevronBack } from "react-icons/io5";
import { useLocation } from 'wouter';

const BackButton = ({ href, label }) => {
  const [, setLocation] = useLocation();

  return (
    <button className="inline-flex items-center" onClick={() => setLocation(href)}>
      <IoChevronBack className="mr-4 text-sm sm:text-base" />
      <span className="font-light text-sm sm:text-base leading-4 align-middle">{label}</span>
    </button>
  )
}

export default BackButton;