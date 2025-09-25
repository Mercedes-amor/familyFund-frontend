import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

import FamilyForm from "../components/FamilyForm";
import JoinFamilyForm from "../components/JoinFamilyForm";

function Profile() {
  const { user, loading, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate("/dashboard"); // Redirige usando React Router
  };
  //Para evitar renderizar Profile antes
  // de que cargue UserProvider con los datos del usuario
  if (loading) return <p>Cargando datos del usuario...</p>;
  if (!user) return <p>No estás logueado.</p>;

  console.log("Profile render → user:", user);

  return (
    <div className="profile-container">
      <h3>Perfil del usuario</h3>
      <p>
        <strong>Nombre:</strong> {user.nombre}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Tu familia:</strong>{" "}
        {user.family
          ? user.family.name
          : "Todavía no te has unido a una familia"}
      </p>

      {!user.family && (
        <div className="family-forms">
          <FamilyForm />
          <JoinFamilyForm userId={user.id} />
        </div>
      )}
      {/* Botón para ir al Dashboard */}
      <button
        onClick={goToDashboard}
        style={{
          padding: "5px 10px",
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Ir al Dashboard
      </button>
      <button onClick={logout} style={{ marginTop: "20px" }}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default Profile;
