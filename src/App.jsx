import './App.css'
import React from 'react';
import Dropdown from './components/Dropdown'

const App = () => {
  return (
    <div>
      <Dropdown label="More">
        <a href="#level5"> Level 5 </a>
        <a href="#level5"> Level 6 </a>
        <a href="#conversation"> Conversation </a>
      </Dropdown>
    </div>
  );
};

export default App;
