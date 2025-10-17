import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";

import axios from "axios";

import "../ProfilePage.css";
import "react-toastify/dist/ReactToastify.css";

export default function JoinFamilyForm({ onFamilyJoined }) {
  const { user, setUser } = useContext(UserContext);
  const [familyId, setFamilyId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/families/join",
        { userId: user.id, familyId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Toast de éxito
      toast.success(`Te has unido a la familia con ID ${familyId}`);
      setFamilyId(""); // limpiar input

      // Retrasamos 2s la actualización del usuario para que se vea el toast
      setTimeout(() => {
        const newFamily = response.data; // MemberResponse del backend
        setUser((prev) => ({ ...prev, family: newFamily }));
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, family: newFamily })
        );

        // Callback opcional para actualizar listas en el padre
        if (onFamilyJoined) onFamilyJoined(newFamily);
      }, 2000);
    } catch (error) {
      console.error("Error al unirse a familia:", error);
      toast.error(
        error.response?.data?.message || "Error al unirse a la familia"
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="general-form">
        <h4>Unirse a una familia</h4>
        <div>
          <input
            type="text"
            placeholder="Introduce el ID de la familia"
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Unirse</button>
      </form>
    </div>
  );
}
