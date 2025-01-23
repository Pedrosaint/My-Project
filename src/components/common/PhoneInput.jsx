// import React, { useContext } from "react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { ThemeContext } from "../context/ContextTheme";


// const PhoneNumberInput = ({ phone, handlePhoneChange }) => {
//   const { theme } = useContext(ThemeContext);
//   const darkMode = theme === "dark";

//   return (
//     <>
//     <label
//       htmlFor="phoneNumber"
//       className="block text-sm font-medium text-gray-700 capitalize dark:text-white"
//     >
//       Phone Number
//     </label>
//     <div
//       className={`flex mt-1 ${
//         darkMode ? "dark:bg-gray-800 dark:text-gray-300" : "bg-white text-black"
//       }`}
//     >
//       <PhoneInput
//         country={"ng"} // Default to Nigeria
//         value={phone}
//         onChange={handlePhoneChange}
//         inputStyle={{
//           width: "100%",
//           borderRadius: "0.375rem",
//           padding: "0.5rem",
//           paddingLeft: "50px",
//           border: "1px solid",
//           borderColor: darkMode ? "#4b5563" : "#ccc",
//           backgroundColor: darkMode ? "#1f2937" : "#fff",
//           color: darkMode ? "#fff" : "#000",
//         }}
//         dropdownStyle={{
//           borderRadius: "0.375rem",
//           backgroundColor: darkMode ? "#1f2937" : "#fff",
//           color: darkMode ? "#fff" : "#000",
//           borderColor: darkMode ? "#1f2937" : "#ccc",
//         }}
//         containerStyle={{
//           width: "100%",
//         }}
//         buttonStyle={{
//           backgroundColor: darkMode ? "#1f2937" : "#fff",
//           color: darkMode ? "#fff" : "#000",
//           borderColor: darkMode ? "#4b5563" : "#ccc",
//         }}
//         searchStyle={{
//           backgroundColor: darkMode ? "#1f2937" : "#fff",
//           color: darkMode ? "#fff" : "#000",
//           borderColor: darkMode ? "#1f2937" : "#ccc",
//         }}
//         dropdownClass="custom-phone-dropdown"
//       />
//       </div>
//       </>
//   );
// };

// export default PhoneNumberInput;



// import React, { useContext, useState } from "react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { ThemeContext } from "../context/ContextTheme";


// const PhoneNumberInput = ({ phone, handlePhoneChange }) => {
//   const { theme } = useContext(ThemeContext);
//   const darkMode = theme === "dark";

//   // Validation states
//   const [error, setError] = useState("");
//   const [isTouched, setIsTouched] = useState(false); // Tracks if the field was touched

//   const handlePhoneInputChange = (value) => {
//     if (typeof handlePhoneChange === "function") {
//       handlePhoneChange(value); // Update phone number in parent
//     }

//     setIsTouched(true); // Mark field as touched

//     // Validation logic
//     const phoneLength = value.replace(/[^0-9]/g, "").length; // Remove non-numeric characters and calculate length
//     const isValidLength = phoneLength >= 10 && phoneLength <= 15; // Define acceptable length range

//     if (!isValidLength) {
//       setError("Phone number must be between 10 and 15 digits.");
//     } else {
//       setError(""); // Clear error if valid
//     }
//   };

//   const handleBlur = () => {
//     setIsTouched(true);
//     if (!phone || phone.trim() === "") {
//       setError("This field is required.");
//     }
//   };

//   return (
//     <>
//       <label
//         htmlFor="phoneNumber"
//         className="block text-sm font-medium text-gray-700 capitalize dark:text-white"
//       >
//         Phone Number
//       </label>
//       <div
//         className={`flex mt-1 flex-col relative ${
//           darkMode
//             ? "dark:bg-gray-800 dark:text-gray-300"
//             : "bg-white text-black"
//         }`}
//       >
//         <PhoneInput
//           country={"ng"} // Default to Nigeria
//           value={phone}
//           onChange={handlePhoneInputChange}
//           onBlur={handleBlur} // Trigger validation when the field loses focus
//           inputStyle={{
//             width: "100%",
//             borderRadius: "0.375rem",
//             padding: "0.5rem",
//             paddingLeft: "50px",
//             border: "1px solid",
//             borderColor: error
//               ? "#f87171" // Red border if error
//               : darkMode
//               ? "#4b5563"
//               : "#ccc",
//             backgroundColor: darkMode ? "#1f2937" : "#fff",
//             color: darkMode ? "#fff" : "#000",
//           }}
//           dropdownStyle={{
//             borderRadius: "0.375rem",
//             backgroundColor: darkMode ? "#1f2937" : "#fff",
//             color: darkMode ? "#fff" : "#000",
//             borderColor: darkMode ? "#1f2937" : "#ccc",
//           }}
//           containerStyle={{
//             width: "100%",
//           }}
//           buttonStyle={{
//             backgroundColor: darkMode ? "#1f2937" : "#fff",
//             color: darkMode ? "#fff" : "#000",
//             borderColor: darkMode ? "#4b5563" : "#ccc",
//           }}
//           searchStyle={{
//             backgroundColor: darkMode ? "#1f2937" : "#fff",
//             color: darkMode ? "#fff" : "#000",
//             borderColor: darkMode ? "#1f2937" : "#ccc",
//           }}
          // dropdownClass="custom-phone-dropdown"
//         />
//       </div>
//     </>
//   );
// };

// export default PhoneNumberInput;

import React, { useContext, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ThemeContext } from "../context/ContextTheme";

const PhoneNumberInput = ({ phone, handlePhoneChange }) => {
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

  // Validation states
  const [error, setError] = useState("");
  const [isTouched, setIsTouched] = useState(false); // Tracks if the field was touched

  const handlePhoneInputChange = (value) => {
    if (typeof handlePhoneChange === "function") {
      handlePhoneChange(value); // Update phone number in parent
    }

    setIsTouched(true); // Mark field as touched

    // Validation logic
    const phoneLength = value.replace(/[^0-9]/g, "").length; // Remove non-numeric characters and calculate length
    const isValidLength = phoneLength >= 10 && phoneLength <= 15; // Define acceptable length range

    if (!isValidLength) {
      setError("Phone number must be between 10 and 15 digits.");
    } else {
      setError(""); // Clear error if valid
    }
  };

  const handleBlur = () => {
    setIsTouched(true);
    if (!phone || phone.trim() === "") {
      setError("This field is required.");
    }
  };

  return (
    <div className="mb-4">
      <label
        htmlFor="phoneNumber"
        className="block text-sm font-medium text-gray-700 capitalize dark:text-white"
      >
        Phone Number
      </label>
      <div className="relative mt-1">
        <PhoneInput
          country={"ng"} // Default to Nigeria
          value={phone}
          onChange={handlePhoneInputChange}
          onBlur={handleBlur} // Trigger validation when the field loses focus
          inputStyle={{
            width: "100%",
            borderRadius: "0.375rem",
            padding: "0.5rem",
            paddingLeft: "3rem", // Adjust padding for the flag icon
            border: "none", // Remove border here; the container will handle it
            backgroundColor: darkMode ? "#1f2937" : "#fff",
            color: darkMode ? "#fff" : "#000",
          }}
          containerStyle={{
            width: "100%",
            borderRadius: "0.375rem",
            border: "1px solid",
            borderColor: error
              ? "#f87171" // Red border for errors
              : darkMode
              ? "#4b5563"
              : "#ccc",
            backgroundColor: darkMode ? "#1f2937" : "#fff",
          }}
          buttonStyle={{
            position: "absolute",
            left: "0.5rem", // Align the flag button
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            backgroundColor: darkMode ? "#1f2937" : "#fff",
          }}
          dropdownStyle={{
            borderRadius: "0.375rem",
            backgroundColor: darkMode ? "#1f2937" : "#fff",
            color: darkMode ? "#fff" : "#000",
          }}
          dropdownClass="custom-phone-dropdown"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default PhoneNumberInput;
