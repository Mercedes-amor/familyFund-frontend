import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Usamos localStorage.getItem("user") directamente
    axios
      .get(`http://localhost:8080/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos del usuario:", error);
      });
  }, [userId]);

  return (
    <div>
      <h3>Perfil del usuario con ID: {userId}</h3>
      {userData ? (
        <>
          <p>Nombre: {userData.nombre}</p>
          <p>Email: {userData.email}</p>
        </>
      ) : (
        <p>Cargando datos del usuario...</p>
      )}
    </div>
  );
}

export default Profile;
