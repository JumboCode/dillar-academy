import React, { useState } from 'react';

//use isOpen to keep track of whether the dropdown menu is visible
const Dropdown = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative inline-block text-left"
      //use onMouseEnter and onMouseLeave to track the mouse
      //If the mouse is on the menu, turn state to true, otherwise false
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="dropdown-button">{label}</button>
      {isOpen && (
        <div className="absolute left-0">
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
