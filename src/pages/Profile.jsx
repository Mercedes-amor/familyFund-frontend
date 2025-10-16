import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

import FamilyForm from "../components/FamilyForm";
import JoinFamilyForm from "../components/JoinFamilyForm";

//Estilos
import { ClipLoader, SyncLoader } from "react-spinners";
import "../ProfilePage.css";

function Profile() {
  const { user, loading, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate("/dashboard"); // Redirige usando React Router
  };
  //Para evitar renderizar Profile antes
  // de que cargue UserProvider con los datos del usuario
  if (loading) {
    return (
      <div className="spinner-div">
        <SyncLoader color="#d4e2e1ff" size={15} />
      </div>
    );
  }

  // Variables para simplificar condicionales
  const isAdmin = user?.rol === "ROLE_ADMIN";
  const isUser = user?.rol === "ROLE_USER";

  if (!user) return <p>No estás logueado.</p>;

  console.log("Profile render → user:", user);

  return (
    <div className="profile-container">
      <h2 className="h2-title">Perfil del usuario</h2>
      <p>
        <strong>Nombre:</strong> {user.nombre}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>

      {isAdmin && (
        <p>
          <strong>Administrador</strong>{" "}
        </p>
      )}
      {isUser && (
        <>
          <p>
            <strong>Tu familia:</strong>{" "}
            {user.family
              ? user.family.name
              : "Todavía no te has unido a una familia"}
          </p>

          <div className="profile_button_div">
            {/* Botón para ir al Dashboard */}
            <button className="general-AddButton" onClick={goToDashboard}>
              Ir al Dashboard
            </button>
            <button
              className="general-AddButton"
              id="cerrarSesion-btn"
              onClick={logout}
            >
              Cerrar sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
