//Componentes de React
import { useEffect, useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";

//Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
//Components and pages
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Error from "./pages/Error";
import Navbar  from "./components/Navbar";
import { ThemeContext } from "./context/theme.context.jsx";

function App() {

  //Traemos la información del ThemeContext mediante el useContext
  const {isThemeDark, handleSwitchTheme, btnThemeClassName} = useContext(ThemeContext);

  return (
    <div className={isThemeDark ? "theme-dark": "theme-light"}>
      <Navbar/>
      <button onClick={handleSwitchTheme} className={btnThemeClassName}>Modo oscuro/claro</button>
      <h2>FamilyFund</h2>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile/:userId" element={<Profile />} />

        {/* Rutas para gestionar errores */}
        <Route path="/error" element={<Error />}/>
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </div>
  );
}

export default App;
