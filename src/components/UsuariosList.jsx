import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);

  const cargarUsuarios = async () => {
    const res = await axios.get("/api/admin/usuarios");
    setUsuarios(res.data);
  };

  const borrarUsuario = async (id) => {
    if (window.confirm("¿Seguro que deseas borrar este usuario?")) {
      await axios.delete(`/api/admin/usuarios/${id}`);
      cargarUsuarios();
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">Usuarios</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Apellido</th>
            <th className="p-2">Email</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="text-center border-t">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.nombre}</td>
              <td className="p-2">{u.apellido}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.rol}</td>
              <td className="p-2 space-x-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                  Editar
                </button>
                <button
                  onClick={() => borrarUsuario(u.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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
