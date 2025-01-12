import React, { useContext } from "react";
import { ThemeContext } from "./context/ContextTheme";

const ThemeToggle = () => {
  const { theme, dispatch } = useContext(ThemeContext);

  return (
    <div className="flex items-center space-x-2 ml-2">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={() => dispatch({ type: "TOGGLE_THEME" })}
          className="sr-only peer"
        />
        <div className="w-10 h-6 bg-custom-gradient dark:bg-gray-600 rounded-full peer peer-checked:bg-gray-800 peer-focus:ring-2 peer-focus:ring-primary transition-all">
          <div
            className={`absolute top-1 left-1 w-4 h-4 dark:bg-white bg-gray-800 rounded-full shadow-md transform transition-transform ${
              theme === "dark" ? "translate-x-4" : ""
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default ThemeToggle;
