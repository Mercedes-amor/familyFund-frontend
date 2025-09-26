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

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          FamilyFund
        </NavLink>
        {/* Saludo  */}
        {user ? (
          <li className="nav-item d-flex align-items-center text-white ms-2">
            Hola, {user.nombre}
          </li>
        ) : (
          <></>
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

            {user ? (
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
                  <NavLink className={checkActiveUrl} to="/profile">
                    Perfil
                  </NavLink>
                </li>
                {/* logout */}
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-link nav-link"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className={checkActiveUrl} to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={checkActiveUrl} to="/signup">
                    Signup
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
