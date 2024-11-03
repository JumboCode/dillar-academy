import { useState } from 'react';

const Dropdown = ({ label, children }) => {
  //use isOpen to keep track of whether the dropdown menu is visible
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="absolute inline-block"

      //If the mouse is on the menu, turn state to true, otherwise false
      onClick={() => {
        if (isOpen) {
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
      }
      }
    >
      <button className="dropdown-button text-right">{label}</button>
      {isOpen && (
        <div className="absolute text-right flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;


