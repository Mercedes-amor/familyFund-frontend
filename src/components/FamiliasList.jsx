import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import axios from "axios";
import Swal from "sweetalert2";

//Estilos
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader, SyncLoader } from "react-spinners";

export default function FamiliasList() {
  const [familias, setFamilias] = useState([]);
  const [miembros, setMiembros] = useState({});
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const { user, userLoading } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------- FUNCION PARA CARGAR FAMILIAS ----------
  const fetchFamilias = async () => {
    try {
      const token = localStorage.getItem("token");

      const familiasRes = await fetchWithAuth(
        "http://localhost:8080/api/admin/familias",
        { headers: { Authorization: "Bearer " + token } }
      );
      if (!familiasRes.ok) throw new Error("Error al cargar familias");

      const familiasData = await familiasRes.json();
      setFamilias(familiasData);

      // Cargar miembros
      const miembrosPorFamilia = {};
      for (const f of familiasData) {
        const miembrosRes = await fetchWithAuth(
          `http://localhost:8080/api/families/${f.id}/members`,
          { headers: { Authorization: "Bearer " + token } }
        );
        miembrosPorFamilia[f.id] = miembrosRes.ok
          ? await miembrosRes.json()
          : [];
      }
      setMiembros(miembrosPorFamilia);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------- USE EFFECT PARA CARGAR AL INICIO ----------
  useEffect(() => {
    if (!userLoading) {
      fetchFamilias();
    }
  }, [user, userLoading]);

  // ---------- BORRAR FAMILIA ----------
  const borrarFamilia = async (id) => {
    //Cambiamos el típico windows.confirm por la librería Swal
    const result = await Swal.fire({
      title: "¿Estás segura?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `http://localhost:8080/api/admin/familias/${id}`,
        { headers: { Authorization: "Bearer " + token } }
      );

      if (res.status === 204) {
        setFamilias((prev) => prev.filter((f) => f.id !== id));
        toast.success("Familia eliminada correctamente");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al borrar la familia");
    }
  };

  // ---------- GUARDAR EDICIÓN ----------
  const guardarEdicion = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetchWithAuth(
        `http://localhost:8080/api/admin/familias/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ name: nuevoNombre }),
        }
      );

      if (!res.ok) throw new Error("Error al editar familia");

      setEditandoId(null);
      fetchFamilias();
    } catch (error) {
      console.error("Error al editar familia:", error);
    }
  };

  if (loading)
    return (
      <div className="spinner-div">
        <SyncLoader color="#113941" size={15} />
      </div>
    );

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        style={{ marginTop: "70px", zIndex: 9999 }}
      />
      <h2>Familias</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Código</th>
            <th>Miembros</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {familias.map((f) => (
            <tr key={f.id}>
              <td>{f.id}</td>

              {/* --- Celda de nombre --- */}
              <td>
                {editandoId === f.id ? (
                  <input
                    type="text"
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    autoFocus
                  />
                ) : (
                  f.name
                )}
              </td>

              <td>{f.code}</td>

              <td>
                {miembros[f.id] && miembros[f.id].length > 0 ? (
                  <ul>
                    {miembros[f.id].map((m) => (
                      <li key={m.id}>
                        {m.nombre} ({m.email})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>Sin miembros</span>
                )}
              </td>

              {/* --- Acciones --- */}
              <td>
                {editandoId === f.id ? (
                  <>
                    <button onClick={() => guardarEdicion(f.id)}>
                      Guardar
                    </button>

                    <button onClick={() => setEditandoId(null)}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditandoId(f.id);
                        setNuevoNombre(f.name);
                      }}
                      className="button-edit"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => borrarFamilia(f.id)}
                      className="button-delete"
                    >
                      Borrar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
