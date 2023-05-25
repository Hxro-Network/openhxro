import React, { memo, useState } from 'react';
import { MenuItem } from '@mui/material';
import { WrapperDropdown } from './Dropdown.style';
import { useEffect } from 'react';

function Dropdown({ options = [], defaultOption = {}, onSelect }) {
  const [selectedOption, setSelectedOption] = useState(defaultOption);

  useEffect(() => {
    setSelectedOption(defaultOption);
  }, [defaultOption]);

  const handleSelect = (event) => {
    const selectedValue = event.target.value;
    const selectedOption = options.find(
      (option) => option.value === selectedValue
    );
    setSelectedOption(selectedOption);
    onSelect(selectedOption);
  };

  return (
    <WrapperDropdown value={selectedOption.value} onChange={handleSelect}>
      {options.map((option, index) => (
        <MenuItem key={index} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </WrapperDropdown>
  );
}

export default memo(Dropdown);
