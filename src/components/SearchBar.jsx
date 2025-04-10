import { IoSearch } from "react-icons/io5";

const SearchBar = ({ input, setInput, placeholder }) => {
  return (
    <div className="w-full inline-flex gap-x-3 items-center py-3 px-4 rounded-sm border border-gray-300">
      <IoSearch size={16.81} className="text-gray-400" />
      <input
        type="text"
        className="w-full border-none outline-none text-[18px]"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  )
}

export default SearchBar;