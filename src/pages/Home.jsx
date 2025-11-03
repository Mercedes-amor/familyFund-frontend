import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import "../Home.css";

function Home() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const checkActiveUrl = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  const isLoggedIn = !!user;

  return (
    <div className="homeContainer">
      <div className="left-panel">
        <img id="homeLogo" src="public/logo.png" alt="Logo"></img>
        {/* Saludo */}
        {isLoggedIn && user.nombre && (
          <div>
               <p className="saludoHome">
            Bienvenido <b>{user.nombre}</b>
          </p>
          </div>
       
        )}
      </div>

      {/* USER */}
      {!isLoggedIn && (
        <div className="right-panel">
          <button onClick={() => navigate("/login")}>Iniciar Sesión</button>
          <button onClick={() => navigate("/signup")}>Registrarse</button>
        </div>
      )}
    </div>
  );
}

export default Home;
