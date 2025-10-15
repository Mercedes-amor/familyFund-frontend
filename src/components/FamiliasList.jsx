import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FamiliasList() {
  const [familias, setFamilias] = useState([]);

  const cargarFamilias = async () => {
    const res = await axios.get("/api/admin/familias");
    setFamilias(res.data);
  };

  const borrarFamilia = async (id) => {
    if (window.confirm("¿Seguro que deseas borrar esta familia?")) {
      await axios.delete(`/api/admin/familias/${id}`);
      cargarFamilias();
    }
  };

  useEffect(() => {
    cargarFamilias();
  }, []);

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">Familias</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Código</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {familias.map((f) => (
            <tr key={f.id} className="text-center border-t">
              <td className="p-2">{f.id}</td>
              <td className="p-2">{f.name}</td>
              <td className="p-2">{f.code}</td>
              <td className="p-2 space-x-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                  Editar
                </button>
                <button
                  onClick={() => borrarFamilia(f.id)}
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
