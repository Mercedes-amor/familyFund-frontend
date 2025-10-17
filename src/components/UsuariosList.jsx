import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { fetchWithAuth } from "../utils/fetchWithAuth";

//Estilos
import "../AdminDashboard.css";
import { ClipLoader, SyncLoader } from "react-spinners";

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const { user, userLoading } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // CARGAR DATOS
  useEffect(() => {
    if (userLoading) return;

    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");
        // console.log(token);

        //Obtenemos usuarios
        const usuariosRes = await fetchWithAuth(
          "http://localhost:8080/api/admin/usuarios",
          {
            headers: { Authorization: "Bearer " + token },
          }
        );

        if (!usuariosRes.ok) throw new Error("Error al cargar usuarios");
        const usuariosData = await usuariosRes.json();

        //En el estado cargamos las categorías con sus transacciones
        setUsuarios(usuariosData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();

    const borrarUsuario = async (id) => {
      if (window.confirm("¿Seguro que deseas borrar este usuario?")) {
        await axios.delete(`/api/admin/usuarios/${id}`);
        fetchUsuarios();
      }
    };
  }, [user, userLoading]);

   if (loading)
    return (
      <div className="spinner-div">
        <SyncLoader color="#113941" size={15} />
      </div>
    );

  return (
    <div>
      <h2>Usuarios</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Familia Id</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="text-center border-t">
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.apellido}</td>
              <td>{u.email}</td>
              <td>{u.familyId}</td>
              <td>{u.rol}</td>
              <td>
                <button className="button-edit">
                  Editar
                </button>
                <button
                  onClick={() => borrarUsuario(u.id)}
                  className="button-delete"
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
