import { createContext, useContext, useState } from "react";

// 1️⃣ Create Context
const ThemeContext = createContext();

// 2️⃣ Provider
export const ThemeProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  return (
    <ThemeContext.Provider value={{ isAdminLoggedIn, setIsAdminLoggedIn }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3️⃣ Custom Hook (safe usage)
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used inside ThemeProvider");
  }
  return context;
};
