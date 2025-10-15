import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import UsuariosList from "../components/UsuariosList";
import FamiliasList from "../components/FamiliasList";

export default function AdminDashboard() {
  const [selected, setSelected] = useState("usuarios");

  return (
    <div className="flex">
      <AdminSidebar selected={selected} onSelect={setSelected} />
      <div className="flex-1 bg-gray-50 min-h-screen">
        {selected === "usuarios" && <UsuariosList />}
        {selected === "familias" && <FamiliasList />}
      </div>
    </div>
  );
}
