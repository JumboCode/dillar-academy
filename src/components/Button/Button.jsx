const Button = ({ type = "button", label, isOutline, onClick, isRound, isDisabled }) => {
  return (
    <button
      type={type}
      className={`
        ${isDisabled
          ? 'bg-gray-300 text-white cursor-not-allowed'
          : `transition-colors duration-300 border border-dark-blue-800 
          ${isOutline
            ? 'text-dark-blue-800 bg-white hover:text-white hover:bg-dark-blue-800'
            : 'text-white bg-dark-blue-800 hover:text-dark-blue-800 hover:bg-white'}`} 
          ${isRound
          ? 'rounded-full p-3'
          : 'rounded-sm px-4 py-2'}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {label}
    </button>
  );
};

export default Button;