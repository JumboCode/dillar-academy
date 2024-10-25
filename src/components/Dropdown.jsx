import React, { useState } from 'react';

//use isOpen to keep track of whether the dropdown menu is visible
const Dropdown = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      class="absolute inline-block"
      //use onMouseEnter and onMouseLeave to track the mouse
      //If the mouse is on the menu, turn state to true, otherwise false
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button class="dropdown-button">{label}</button>
      {isOpen && (
        <div class="absolute">
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
