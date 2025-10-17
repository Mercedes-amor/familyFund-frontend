import React, { useState } from "react";
import { UserContext } from "../context/UserContext";
import Swal from "sweetalert2";

import "../AdminDashboard.css";

// import AdminSidebar from "../components/AdminSidebar.bak";
import UsuariosList from "../components/UsuariosList";
import FamiliasList from "../components/FamiliasList";

export default function AdminDashboard() {
  const [selected, setSelected] = useState("");
  const [vista, setVista] = useState("");

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h1>Admin Dashboard</h1>
        <button
          className={`${vista === "usuarios" ? "active" : ""}`}
          onClick={() => setVista("usuarios")}
        >
          Usuarios
        </button>
        <button
          className={`${vista === "familias" ? "active" : ""}`}
          onClick={() => setVista("familias")}
        >
          Familias
        </button>
      </div>

      {/* Contenido principal */}
      <div className="main-content">
        {vista === "usuarios" && <UsuariosList />}
        {vista === "familias" && <FamiliasList />}
      </div>
    </div>
  );
}
