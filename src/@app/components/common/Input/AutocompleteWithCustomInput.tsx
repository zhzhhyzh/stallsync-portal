import React, { useState } from 'react';
import { Box, Input, List, ListItem, Text } from '@chakra-ui/react';

const AutocompleteWithCustomInput = ({ isAnimating, newInd, value, handleChange,options, onSelect, onHandleNewItem }:any) => {
  // const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [showDropdown, setShowDropdown] = useState(false);

  // const handleChange = (event:any) => {
  //   const value = event.target.value;
  //   setInputValue(value);

  //   // Filter options based on user input
  //   const filtered = options.filter((option:any) =>
  //     option.toLowerCase().startsWith(value.toLowerCase())
  //   );
  //   setFilteredOptions(filtered);
  //   setShowDropdown(true);
  // };

  // const handleSelect = (selectedValue:any) => {
  //   setInputValue(selectedValue);
  //   setShowDropdown(false);
  //   onSelect(selectedValue); // Pass the selected or entered value to the parent component
  // };

  const handleBlur = () => {
    // Delay hiding dropdown to allow item selection
    setTimeout(() => setShowDropdown(false), 100);
  };
  const getMessageDetails = (isNewCustomer:boolean) => ({
    text: isNewCustomer ? "This is a new customer" : "Customer already exists",
    color: isNewCustomer ? "blue.300" : "green.300",
  });
  
  const messageDetails = getMessageDetails(newInd);
  
  return (
    <Box width="100%" maxW="400px" mx="auto" position="relative">
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideOut {
            from {
              opacity: 1;
              transform: translateY(0);
            }
            to {
              opacity: 0;
              transform: translateY(-10px);
            }
          }
        `}
      </style>
      <Input
        value={value}
        onChange={handleChange}
        onFocus={() => setShowDropdown(true)}
        onBlur={handleBlur}
        placeholder="Select or add a new customer"
      />
  {value && (
  <Text
    sx={{
      opacity: isAnimating ? 0 : 1,
      transform: isAnimating ? "translateY(-10px)" : "translateY(0)",
      animation: isAnimating ? "slideOut 0.3s ease forwards" : "slideIn 0.3s ease forwards",
    }}
    color={messageDetails.color}
    fontSize={15}
    mt={1}
  >
    {messageDetails.text}
  </Text>
)}
     
    </Box>
  );
};

export default AutocompleteWithCustomInput;
