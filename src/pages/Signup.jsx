import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    email: "",
    password: "",
    // Rol será por defecto USER
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/auth/signup", form);
      setMensaje(response.data.message || "Usuario registrado correctamente");
    } catch (error) {
      if (error.response) {
        setMensaje(error.response.data.message || "Error en el registro");
      } else {
        setMensaje("Error de conexión");
      }
    }
  };

  return (
    <div className="login-container">
      <h2 className="loginH2">Crear Usuario</h2>

      <form onSubmit={handleSubmit} className="login-form">
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={20}
        />
        <input
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={20}
        />
        <input
          type="number"
          name="edad"
          placeholder="Edad"
          value={form.edad}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          maxLength={50}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={40}
        />
        <button type="submit">Registrarse</button>
        {mensaje && <p>{mensaje}</p>}
      </form>
    </div>
  );
}

export default Signup;
