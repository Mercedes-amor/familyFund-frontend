import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Creamos el contexto
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();

  // Inicializamos user directamente desde localStorage si existe
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    // Si ya tenemos user en memoria, no necesitamos reconstruir
    if (user) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setLoading(false);
      return;
    }

    console.log("UserProvider → token:", localStorage.getItem("token"));
    console.log("UserProvider → userId:", localStorage.getItem("userId"));
    console.log("UserProvider → user:", localStorage.getItem("user"));

    // Reconstruimos usuario desde backend
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/auth/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(res.data);
        console.log("Usuario desde backend:", res.data);

        localStorage.setItem("user", JSON.stringify(res.data)); // actualizar cache
      } catch (err) {
        console.error("Error reconstruyendo usuario:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]); // quitamos "user" de dependencias

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};
