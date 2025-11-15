import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ToastContainer, toast } from "react-toastify";

import "../LoginSignupPage.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  //Estado sesión expirada
  const location = useLocation();
  const sessionExpired = new URLSearchParams(location.search).get(
    "sessionExpired"
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/signin",
        { email, password }
      );

      //Comprobar estado antes de guardar
      console.log("LOGIN RESPONSE:", response.data.family);
      console.log("Token:", response.data.accessToken);
      console.log("UserId:", response.data.id);
      console.log("response.data.rol: " + response.data.rol)

      // Guardar token y user en localStorage
      localStorage.setItem("token", String(response.data.accessToken));
      localStorage.setItem("userId", String(response.data.id));
      localStorage.setItem("user", JSON.stringify(response.data));

      //Comprobar estado después de guardar
      console.log("LOCALSTORAGE TOKEN:", localStorage.getItem("token"));
      console.log("LOCALSTORAGE USERID:", localStorage.getItem("userId"));
      console.log("LOCALSTORAGE USER:", localStorage.getItem("user"));

      // Actualizamos el contexto para que Profile tenga los datos inmediatamente
      setUser(response.data);
      //Si aún no tiene family lo redirijimos a /profile para que cree o se una a una
      if (response.data.rol === "ROLE_ADMIN") {
        navigate("/AdminDashboard");
      } else if (response.data.family != null && response.data.rol === "ROLE_USER") {
        navigate("/Dashboard");
      } else {
        navigate("/Profile");
      }
    } catch (error) {
      console.error("Error en login:", error);
      // alert("Credenciales inválidas o error del servidor.");
      if (error.response?.status === 401) {
        toast.error("Credenciales inválidas");
      }
    }
  };

  return (
    <div className="login-container">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        style={{ marginTop: "70px", zIndex: 9999 }}
      />
      <h2 className="h2-title">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="general-form">
        <label>
          Email:
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label>
          Contraseña:
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <button type="submit">Entrar</button>
      </form>
      <div>
        {sessionExpired && (
          <p
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              color: "red",
              margin: "30px",
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            Tu sesión ha expirado. Inicia sesión nuevamente.
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
