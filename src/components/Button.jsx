
const Button = ({ isOutline, label }) => {
  return (
    <button
      className={`px-4 py-2 font-semibold rounded-lg transition-colors duration-300 ${isOutline
        ? 'border border-blue-500 text-black-500 bg-white'
        : 'bg-blue-700 text-black'
        }`}
    >
      {label}
    </button>
  );
};

export default Button;

