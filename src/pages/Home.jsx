import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Home() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const checkActiveUrl = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  const isLoggedIn = !!user;

  return (
    <div className="container">
      <div className="left-panel">
        <h1>FamilyFund</h1>
        <p>EL AHORRO EMPIEZA CON EL CONTROL</p>
        {/* Saludo */}
        {isLoggedIn && user.nombre && (
          <p className="saludoHome">
            Bienvenido{" "}
            
              <b>{user.nombre}</b>
            
          </p>
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
