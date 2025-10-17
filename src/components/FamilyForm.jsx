import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { fetchWithAuth } from "../utils/fetchWithAuth";

import "react-toastify/dist/ReactToastify.css";

import "../ProfilePage.css";

export default function FamilyForm({ onFamilyCreated }) {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }

    try {
      // Crear la familia en el backend
      const response = await fetchWithAuth(
        "http://localhost:8080/api/families/newfamily",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ name }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al crear la familia");
      }

      const newFamily = await response.json();

      // Mostramos toast de éxito
      console.log("Llegamos al toast de éxito", newFamily);
      toast.success("Familia creada correctamente");
      setName("");

      // Retrasamos 2s la actualización del usuario para que se vea el toast
      setTimeout(() => {
        setUser((prev) => ({ ...prev, family: newFamily }));
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, family: newFamily })
        );
      }, 2000);

      // Si hay callback para actualizar listas en el padre
      if (onFamilyCreated) {
        onFamilyCreated(newFamily);
      }
    } catch (err) {
      toast.error(err.message || "Error de conexión");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="general-form">
        <h4>Crear Nueva Familia</h4>
        <div>
          <input
            type="text"
            placeholder="Ponle un nombre a tu familia"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Crear Familia</button>
      </form>
    </div>
  );
}
