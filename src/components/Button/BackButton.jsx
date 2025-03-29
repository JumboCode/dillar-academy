import { IoChevronBack } from "react-icons/io5";

const BackButton = ({ label }) => {
  return (
    <button className="flex items-center" onClick={() => history.back()}>
      <IoChevronBack className="mr-4 text-sm sm:text-base" />
      <span className="inline-block font-light text-sm leading-none sm:text-base align-baseline">{label}</span>
    </button>
  )
}

export default BackButton;