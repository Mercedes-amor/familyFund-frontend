import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import FamilyForm from "../components/FamilyForm";
import JoinFamilyForm from "../components/JoinFamilyForm";

function Profile() {
  const { user, loading, logout } = useContext(UserContext);

  //Para evitar renderizar Profile antes 
  // de que cargue UserProvider con los datos del usuario
  if (loading) return <p>Cargando datos del usuario...</p>;
  if (!user) return <p>No estás logueado.</p>;

  console.log("Profile render → user:", user);

  return (
    <div className="profile-container">
      <h3>Perfil del usuario</h3>
      <p><strong>Nombre:</strong> {user.nombre}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p>
        <strong>Tu familia:</strong>{" "}
        {user.family ? user.family.name : "Todavía no te has unido a una familia"}
      </p>

      {!user.family && (
        <div className="family-forms">
          <FamilyForm userId={user.id} />
          <JoinFamilyForm userId={user.id} />
        </div>
      )}

      <button onClick={logout} style={{ marginTop: "20px" }}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default Profile;


