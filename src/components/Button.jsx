const Button = ({ label, isOutline, onClick, className = "" }) => {
  return (
    <button
      className={`
        px-6 
        py-2.5 
        rounded-lg 
        font-medium 
        transition-all 
        duration-300 
        ${isOutline
          ? 'border border-dark-blue-800 text-dark-blue-800 bg-white hover:bg-dark-blue-50'
          : 'bg-dark-blue-800 text-white hover:bg-dark-blue-700'
        }
        ${className}
      `}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;