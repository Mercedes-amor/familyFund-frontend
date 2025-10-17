import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

//Estilos
import "../AdminDashboard.css";
import { ClipLoader, SyncLoader } from "react-spinners";

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const { user, userLoading } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // CARGAR DATOS

  // Función de carga de usuarios
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const usuariosRes = await fetch(
        "http://localhost:8080/api/admin/usuarios",
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      if (!usuariosRes.ok) throw new Error("Error al cargar usuarios");
      const usuariosData = await usuariosRes.json();
      setUsuarios(usuariosData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // CARGAR DATOS AL MONTAR COMPONENTE
  useEffect(() => {
    if (!userLoading) fetchUsuarios();
  }, [user, userLoading]);

  // EDITAR USUARIO
  const editarUsuario = (usuario) => {
    Swal.fire({
      title: `Editar usuario: ${usuario.nombre}`,
      html: `
      <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${
        usuario.nombre
      }">
      <input id="swal-apellido" class="swal2-input" placeholder="Apellido" value="${
        usuario.apellido
      }">
      <input id="swal-edad" type="number" class="swal2-input" placeholder="Edad" value="${
        usuario.edad ?? ""
      }">
      <input id="swal-email" class="swal2-input" placeholder="Email" value="${
        usuario.email
      }">
      <input id="swal-rol" class="swal2-input" placeholder="Rol (ADMIN o USER)" value="${
        usuario.rol
      }">
      <input id="swal-family" type="number" class="swal2-input" placeholder="ID de familia (vacío = sin familia)" value="${
        usuario.familyId ?? ""
      }">
    `,
      showCancelButton: true,
      confirmButtonText: "Guardar cambios",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        return {
          nombre: document.getElementById("swal-nombre").value.trim(),
          apellido: document.getElementById("swal-apellido").value.trim(),
          edad: parseInt(document.getElementById("swal-edad").value, 10) || 0,
          email: document.getElementById("swal-email").value.trim(),
          rol: document.getElementById("swal-rol").value.trim().toUpperCase(),
          familyId: document.getElementById("swal-family").value
            ? parseInt(document.getElementById("swal-family").value, 10)
            : null,
        };
      },
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          `http://localhost:8080/api/admin/usuarios/${usuario.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(result.value), // enviamos solo el DTO
          }
        );

        if (res.ok) {
          Swal.fire(
            "✅ Actualizado",
            "El usuario ha sido modificado.",
            "success"
          );
          if (typeof fetchUsuarios === "function") fetchUsuarios();
        } else {
          const msg = await res.text();
          Swal.fire("⚠️ Error", `No se pudo actualizar: ${msg}`, "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("❌ Error", "Error de red al actualizar usuario", "error");
      }
    });
  };

  // BORRAR USUARIO
  const borrarUsuario = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
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
      const res = await fetch(
        `http://localhost:8080/api/admin/usuarios/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token },
        }
      );

      if (!res.ok) throw new Error("Error al borrar usuario");

      toast.success("Usuario borrado correctamente");
      fetchUsuarios(); // 🔑 ahora sí recarga la lista
    } catch (err) {
      console.error(err);
      toast.error("Error al borrar usuario");
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
                <button
                  className="button-edit"
                  onClick={() => editarUsuario(u)}
                >
                  Editar
                </button>
                <button
                  className="button-delete"
                  onClick={() => borrarUsuario(u.id)}
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
