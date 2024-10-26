import React, { useState } from 'react';

const Dropdown = ({ label, children }) => {
  //use isOpen to keep track of whether the dropdown menu is visible
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      // style below for menu
      class="absolute inline-block"
      //use onMouseEnter and onMouseLeave to track the mouse
      //If the mouse is on the menu, turn state to true, otherwise false
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        // Set a 1-second delay before closing the menu
        timeoutId = setTimeout(() => {
          setIsOpen(false);
        }, 1000);
      }}
    >
      <button class="dropdown-button text-right">{label}</button>
      {isOpen && (
        // style below for children
        <div class="absolute text-right flex flex-col"> 
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;


