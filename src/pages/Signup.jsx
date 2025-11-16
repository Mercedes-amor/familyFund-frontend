import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import axios from "axios";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    fechaNac: "",
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
      //Calculamos la edad a partir de la fecha de nacimiento
      const today = new Date();
      const birth = new Date(form.fechaNac);
      let edad = today.getFullYear() - birth.getFullYear();
      const mes = today.getMonth() - birth.getMonth();
      //Comprobación si este año ya ha cumplido o no.
      if (mes < 0 || (mes === 0 && today.getDate() < birth.getDate())) {
        edad--;
      }

      //payLoad cambiar la fechaNac por edad
      const payLoad = { ...form, edad };
      delete payLoad.fechaNac; //Para no enviarla

      console.log(payLoad);

      const response = await axios.post(
        "http://localhost:8080/api/auth/signup",
        payLoad
      );

      // Mostrar toast de éxito
      toast.success(
        response.data.message || "!Ya estás registrado! Ahora inicia sesión"
      );

      setMensaje(response.data.message || "Usuario registrado correctamente");

      // redirigir al login en 3s para que se vea el toast
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response) {
        toast.error(error.response?.data?.message || "Error al registrarse");
        setMensaje(error.response?.data?.message);
      } else {
        toast.error("Error de conexión");
        setMensaje("Error de conexión");
      }
    }
  };

  return (
    <div className="login-container">
      <h2 className="loginH2">Crear Usuario</h2>

      <form onSubmit={handleSubmit} className="general-form">
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
        <label>Fecha nacimiento</label>
        <input
          type="date"
          name="fechaNac"
          placeholder="Fecha de nacimiento"
          value={form.fechaNac}
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
        {mensaje && <p className="error-text">{mensaje}</p>}
      </form>
    </div>
  );
}

export default Signup;
