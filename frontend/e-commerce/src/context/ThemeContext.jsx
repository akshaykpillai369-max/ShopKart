import { useState, createContext, useContext, useEffect } from "react";

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export default function ThemeProvider({children}){

    const [theme, setTheme] = useState('dark')

    const toggleTheme = () => {

        if(theme === "dark"){

            setTheme('light')
             
        }

        else {

            setTheme('dark')
            
        }

    }

    useEffect(() => {

        if (theme === "dark") {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }

    }, [theme])

    return(
        <ThemeContext value={{theme, toggleTheme}}>
            {children}
        </ThemeContext>
    )

}