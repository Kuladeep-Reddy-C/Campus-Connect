import React, { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

const STORAGE_KEY = "app-theme-mode";

const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        // Load a theme from localStorage or default to system (kul)
        return localStorage.getItem(STORAGE_KEY) || "system";
    });

    // Apply theme
    useEffect(() => {
        const effective = mode === "system" ? getSystemTheme() : mode;
        document.documentElement.classList.toggle("dark", effective === "dark");
        localStorage.setItem(STORAGE_KEY, mode);
    }, [mode]);

    return (
        <ThemeContext.Provider value={{ mode, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
};
