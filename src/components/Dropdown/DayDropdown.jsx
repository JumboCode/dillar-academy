import Dropdown from '@/components/Dropdown/Dropdown';

const DayDropdown = ({ selectedDay, setSelectedDay }) => {
  const dates = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const handleSelectedDay = (day) => {
    setSelectedDay(day);
  }

  return (
    <Dropdown
      label={
        <div className="flex items-center justify-center gap-x-1">
          <span className={`text-center w-full ${selectedDay ? "" : "text-gray-500"}`}>{selectedDay ? selectedDay : "Select Day"}</span>
        </div>
      }
      buttonClassName="justify-between w-full text-base sm:text-lg py-3 px-4 border border-gray-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
      {dates.map((day) => (
        <button
          type='button'
          key={day}
          className={`
            block w-full py-3 px-4 text-base sm:text-lg 
            ${selectedDay === day ? 'text-blue-500 bg-gray-50' : 'text-gray-700'}
            hover:bg-gray-100`}
          onClick={() => handleSelectedDay(day)}>
          {day}
        </button>
      ))}
    </Dropdown>
  )
}

export default DayDropdown;