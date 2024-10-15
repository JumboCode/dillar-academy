import React from 'react';

const Button = ({ isOutline }) => {
  return (
    <button
      className={`px-4 py-2 font-semibold rounded-lg transition-colors duration-300 ${
        isOutline
          //when isOutline is true
          ? 'border border-blue-500 text-black-500 bg-transparent hover:text-white'
          //when isOutline is false
          : 'bg-white text-black hover:bg-blue-700' 
      }`}
    >
      {isOutline ? 'Learn More' : 'Start Learning'}
    </button>
  );
};

export default Button;
