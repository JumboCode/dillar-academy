import React from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({ selectedLang, onSelectLang }) => (
  <div className="dropdown">
    <label htmlFor="language-select" className="sr-only">Select Language</label>
    <select
      id="language-select"
      value={selectedLang}
      onChange={(e) => onSelectLang(e.target.value)}
      aria-label="Select Language"
    >
      <option value="English">English</option>
      <option value="Russian">Russian</option>
      <option value="Chinese">Chinese</option>
      <option value="Turkish">Turkish</option>
    </select>
  </div>
);

Dropdown.propTypes = {
  selectedLang: PropTypes.string.isRequired,
  onSelectLang: PropTypes.func.isRequired,
};

export default Dropdown;
