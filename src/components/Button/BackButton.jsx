import { IoChevronBack } from "react-icons/io5";

const BackButton = ({ label }) => {
  return (
    <button className="flex items-center" onClick={() => history.back()}>
      <IoChevronBack className="mr-4 text-sm sm:text-base" />
      <p className="font-light text-sm leading-none sm:text-base">{label}</p>
    </button>
  )
}

export default BackButton;