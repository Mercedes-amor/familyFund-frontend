import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SyncLoader from "react-spinners/SyncLoader";

import UploadImage from "../components/UploadImage";
import FamilyForm from "../components/FamilyForm";
import JoinFamilyForm from "../components/JoinFamilyForm";

//Estoñps
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faEdit,
  faTrashArrowUp,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../context/UserContext";

//Estilos
import "../ProfilePage.css";

function Profile() {
  const { user, setUser, loading, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [photoUrl, setPhotoUrl] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (user?.photoUrl) setPhotoUrl(user.photoUrl);
  }, [user]);

  const goToDashboard = () => {
    navigate("/dashboard");
  };
  const updateName = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/auth/user/${user.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: userName }),
        }
      );

      if (!res.ok) {
        console.error("Error al actualizar usuario:", res.status);
        return;
      }

      const updated = await res.json();

      // Actualizamos el contexto entero
      setUser((prev) => ({ ...prev, ...updated }));

      // Actualizar localStorage con todos los campos, aunque solo cambiemos el nombre
      localStorage.setItem("user", JSON.stringify({ ...user, ...updated }));

      toast.success("Nombre actualizado correctamente");
    } catch (err) {
      console.error("Error fetch updateName:", err);
      toast.error("Error al actualizar nombre");
    }
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
      <UploadImage
        currentUrl={user.photoUrl} //Mostramos foto actual guardada en BD
        onUpload={(newUrl) => {
          setPhotoUrl(newUrl); // Actualizamos estado
          setUser({ ...user, photoUrl: newUrl }); // Actualizamos contexto y localStorage
        }}
      />

      {/* NOMBRE Y CAMBIAR NOMBRE FORM */}
      <p className="nameForm">
        <strong>Nombre:</strong> {user.nombre}
        {!editingName && (
          <FontAwesomeIcon
            icon={faEdit}
            style={{ cursor: "pointer", color: "#105c53", fontSize: "1.1rem", marginLeft:"10px"  }}
            onClick={() => setEditingName(true)}
          />
        )}
        {editingName && (
          <div className="nameForm">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Nuevo nombre"
            />
            <div className="nameFormBtn">
              <FontAwesomeIcon
                icon={faCheck}
                style={{
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  marginLeft: "5px",
                }}
                onClick={() => {
                  updateName();
                  setEditingName(false);
                }}
              />
              <FontAwesomeIcon
                icon={faXmark}
                style={{
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  marginLeft: "5px",
                  color: "red",
                }}
                onClick={() => setEditingName(false)}
              />
            </div>
          </div>
        )}
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
          <p>
            <strong>{user.family
              ? <p> <strong style={{color:"rgba(10, 81, 94, 1)"}}> {user.family.code}</strong></p>
              : ""}</strong>{" "}

          </p>
          {/* Mostrar botón si no tiene familia */}
          {!user.family && (
            <div className="profileFormsContainer">
              <FamilyForm />
              <JoinFamilyForm />
            </div>
          )}

          <div className="profile_button_div">
            {user.family && (
              <button className="general-AddButton" onClick={goToDashboard}>
                Ir al Dashboard
              </button>
            )}
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
