import { createContext, useState } from "react";

//Primer componente que pasa el contexto de un lugar a otro
const ThemeContext = createContext();

//Segundo componente envoltorio que  tiene los estados, funciones, variables, etc

const ThemeWrapper = (props) =>{
    //creamos la data que compartiremos
    const [isThemeDark, setIsThemeDark] = useState(false)

    const handleSwitchTheme = () => {
        setIsThemeDark(!isThemeDark)
    }

    //Función para cambiar el color de los botones según modo oscuro/claro
    const btnThemeClassName = isThemeDark === true ? "dark-btn":"light-btn"

    //Creamos un objeto para todo lo que queremos pasar
    const passedContext = {
        isThemeDark,
        handleSwitchTheme,
        btnThemeClassName
    }

    return (
        <ThemeContext.Provider value={passedContext}>
            {props.children} 
        </ThemeContext.Provider>
    )
}

export {
    ThemeContext,
    ThemeWrapper
}