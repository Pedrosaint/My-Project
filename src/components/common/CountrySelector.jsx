import React, { useMemo, useState, useEffect } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

const CountrySelector = () => {
  const options = useMemo(() => countryList().getData(), []);
  const [value, setValue] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is active
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    // Optional: Listen for changes in dark mode
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const changeHandler = (selectedOption) => {
    setValue(selectedOption);
  };

  return (
    <div className="w-full mb-4">
      <label
        htmlFor="phoneNumber"
        className="block text-sm font-medium text-gray-700 capitalize dark:text-white mb-1"
      >
        Country
      </label>
      <Select
        options={options}
        value={value}
        onChange={changeHandler}
        placeholder="Select a country"
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: isDarkMode ? "#1A202C" : "white", // Dark mode bg or white
            borderColor: state.isFocused
              ? isDarkMode
                ? "#4A5568" // Dark mode border
                : "#4299E1" // Light mode border (blue)
              : isDarkMode
              ? "#2D3748"
              : "#CBD5E0", // Default border (gray)
            boxShadow: state.isFocused
              ? `0 0 0 2px ${isDarkMode ? "#4A5568" : "#4299E1"}` // Focus border glow
              : "none",
            color: isDarkMode ? "white" : "black",
            "&:hover": {
              borderColor: isDarkMode ? "#4A5568" : "#4299E1",
            },
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: isDarkMode ? "#1A202C" : "white", // Dropdown bg
            color: isDarkMode ? "white" : "black",
          }),
          option: (base, { isFocused, isSelected }) => ({
            ...base,
            backgroundColor: isSelected
              ? isDarkMode
                ? "#2D3748"
                : "#EDF2F7"
              : isFocused
              ? isDarkMode
                ? "#4A5568"
                : "#E2E8F0"
              : isDarkMode
              ? "#1A202C"
              : "white",
            color: isDarkMode ? "white" : "black",
          }),
          singleValue: (base) => ({
            ...base,
            color: isDarkMode ? "white" : "black", // Selected text color
          }),
          input: (base) => ({
            ...base,
            color: isDarkMode ? "white" : "black", // Input text color when typing
          }),
        }}
      />
    </div>
  );
};

export default CountrySelector;
