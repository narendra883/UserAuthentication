
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    
    useEffect(() => {
        const storedTheme = localStorage.getItem("darkMode");
        setDarkMode(storedTheme === "true");
    }, []);

    
    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
        document.documentElement.classList.toggle("dark", darkMode); // Tailwind CSS toggles
    }, [darkMode]);

    const toggleTheme = () => setDarkMode(prevMode => !prevMode);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
