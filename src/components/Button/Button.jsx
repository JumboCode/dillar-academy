
const Button = ({ label, isOutline, onClick }) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg transition-colors duration-300 ${isOutline
        ? 'border border-dark-blue-800 text-black-500 bg-white'
        : 'text-white bg-dark-blue-800'
        }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;

