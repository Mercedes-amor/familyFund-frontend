import { NavLink } from "react-router-dom";

function Navbar() {
  const checkActiveUrl = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          FamilyFund
        </NavLink>
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
            <li className="nav-item">
              <NavLink className={checkActiveUrl} to="/about">
                Servidor
              </NavLink>
            </li>
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
                Profile
              </NavLink>
            </li>
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
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
