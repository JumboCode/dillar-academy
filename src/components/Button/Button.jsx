const Button = ({ label, isOutline, onClick }) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg transition-colors duration-300 border border-dark-blue-800 ${isOutline
        ? 'text-dark-blue-800 bg-white hover:text-white hover:bg-dark-blue-800'
        : 'text-white bg-dark-blue-800 hover:text-dark-blue-800 hover:bg-white'
        }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;