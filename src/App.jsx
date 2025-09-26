//Componentes de React
import { useEffect, useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeContext } from "./context/theme.context.jsx";

//Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

//Components
import Navbar from "./components/Navbar";


//Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard.jsx";
import Servidor from "./pages/Servidor";
import Profile from "./pages/Profile";
import Categories from "./pages/Categories.jsx";
import NotFound from "./pages/NotFound";
import Error from "./pages/Error";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  //Traemos la información del ThemeContext mediante el useContext
  const { isThemeDark, handleSwitchTheme, btnThemeClassName } =
    useContext(ThemeContext);

  return (
    <div
      className={`app-container ${isThemeDark ? "theme-dark" : "theme-light"}`}
    >
      <Navbar />
      <button onClick={handleSwitchTheme} className={btnThemeClassName}>
        Modo oscuro/claro
      </button>
      <div className="routes-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<Servidor />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/categories" element={<Categories />} />

          <Route path="/error" element={<Error />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
