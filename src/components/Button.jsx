
const Button = ({ label, isOutline, onClick }) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg transition-colors duration-300 ${isOutline
        ? 'border border-cerulean text-black-500 bg-white'
        : 'bg-cerulean text-white bg-dark-blue-800'
        }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;

