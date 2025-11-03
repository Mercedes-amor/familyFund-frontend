import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Navbar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const checkActiveUrl = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Variables para simplificar condicionales
  const isLoggedIn = !!user;
  const isAdmin = user?.rol === "ROLE_ADMIN";
  const isUser = user?.rol === "ROLE_USER";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          FamilyFund
        </NavLink>

        {/* Saludo */}
        {isLoggedIn && user.nombre && (
          <li className="nav-item d-flex align-items-center text-white ms-2">
            <img
              src={
                user.photoUrl ||
                "https://res.cloudinary.com/dz2owkkwa/image/upload/v1760687036/Familyfund/Dise%C3%B1o_sin_t%C3%ADtulo-removebg-preview_vqqzhb.png"
              }
              alt={user.nombre}
              className="member-photo"
            />
            Hola, {user.nombre}
          </li>
        )}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Siempre visible */}
            <li className="nav-item">
              <NavLink className={checkActiveUrl} to="/about">
                Servidor
              </NavLink>
            </li>

            {/* ADMIN */}
            {isAdmin && (
              <>
                <li className="nav-item">
                  <NavLink className={checkActiveUrl} to="/adminDashboard">
                    Admin Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={checkActiveUrl} to="/profile">
                    Perfil
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-link nav-link"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}

            {/* USER */}
            {isUser && (
              <>
                <li className="nav-item">
                  <NavLink className={checkActiveUrl} to="/dashboard">
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={checkActiveUrl} to="/categories">
                    Categorías
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={checkActiveUrl} to="/goals">
                    Objetivos
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={checkActiveUrl} to="/profile">
                    Perfil
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-link nav-link"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}

            {/* Invitado */}
            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <NavLink className={checkActiveUrl} to="/login">
                    Iniciar Sesión
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={checkActiveUrl} to="/signup">
                    Registrarse
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
