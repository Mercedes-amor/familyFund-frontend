import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SyncLoader from "react-spinners/SyncLoader";
import UploadImage from "../components/UploadImage";
import FamilyForm from "../components/FamilyForm";
import JoinFamilyForm from "../components/JoinFamilyForm";
import { ToastContainer, toast } from "react-toastify";

import { UserContext } from "../context/UserContext";

//Estilos
import "../ProfilePage.css";

function Profile() {
  const { user, loading, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    if (user?.photoUrl) setPhotoUrl(user.photoUrl);
  }, [user]);

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="spinner-div">
        <SyncLoader color="#d4e2e1ff" size={15} />
      </div>
    );
  }

  if (!user) return <p>No estás logueado.</p>;

  const isAdmin = user.rol === "ROLE_ADMIN";
  const isUser = user.rol === "ROLE_USER";

  return (
    <div className="profile-container">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        style={{ marginTop: "70px", zIndex: 9999 }}
      />
      <h2 className="h2-title">Perfil del usuario</h2>

      {/* FOTO DE PERFIL */}
      <UploadImage currentUrl={user.photoUrl} onUpload={setPhotoUrl} />

      <p>
        <strong>Nombre:</strong> {user.nombre}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>

      {isAdmin && (
        <p>
          <strong>Administrador</strong>
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

          {/* Mostrar botón si no tiene familia */}
          {!user.family && (
            <div>
              <FamilyForm />
              <JoinFamilyForm />
            </div>
          )}

          <div className="profile_button_div">
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
