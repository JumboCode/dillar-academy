import React, { useState } from 'react';

const Dropdown = ({ label, children }) => {
  //use isOpen to keep track of whether the dropdown menu is visible
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      // style below for menu
      class="absolute inline-block"
      
      //If the mouse is on the menu, turn state to true, otherwise false
      onClick={() => {
          if(isOpen) {
            setIsOpen(false);
          } else{
            setIsOpen(true);
          }
        }
      }
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


