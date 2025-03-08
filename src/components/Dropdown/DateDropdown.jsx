import Dropdown from '@/components/Dropdown/Dropdown';

const DateDropdown = ({ selectedDates, setSelectedDates }) => {
  const dates = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const handleSelectDay = (day) => {
    setSelectedDates(prevDates =>
      prevDates.includes(day)
        ? prevDates.filter(date => date !== day)
        : [...prevDates, day]
    );
  }

  return (
    <Dropdown
      label={
        <div className="flex items-center justify-center gap-x-1">
          <span className="text-center w-full">Select dates</span>
        </div>
      }
      buttonClassName="flex items-center justify-between w-full text-base sm:text-lg w-full py-3 px-4 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300">
      {dates.map((day) => (
        <button
          type='button'
          key={day}
          className={`
            block w-full py-3 px-4 text-base sm:text-lg 
            ${selectedDates.includes(day) ? 'text-blue-500 bg-gray-50' : 'text-gray-700'}
            hover:bg-gray-50`}
          onClick={() => handleSelectDay(day)}>
          {day}
        </button>
      ))}
    </Dropdown>
  )
}

export default DateDropdown;