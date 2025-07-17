import { useEffect, useState } from "react";
//Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
//Components

//Componentes de React-Router
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Error from "./pages/Error";
import Navbar  from "./components/Navbar";
function App() {
  return (
    <>
      <Navbar/>

      <h2>FamilyFund</h2>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile/:userId" element={<Profile />} />

        {/* Rutas para gestionar errores */}
        <Route path="/error" element={<Error />}/>
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </>
  );
}

export default App;
