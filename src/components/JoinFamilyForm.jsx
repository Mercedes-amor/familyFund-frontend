import { useState } from "react";
import axios from "axios";

import "../ProfilePage.css";

function JoinFamilyForm({ userId }) {
  const [familyId, setFamilyId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.post(
        `http://localhost:8080/api/families/join`,
        { userId, familyId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Unido a familia:", response.data);
      alert(`Te has unido a la familia con ID ${familyId}`);
    } catch (error) {
      console.error("Error al unirse a familia:", error);
      alert("Error al unirse a la familia");
    }
  };

  return (
    <div className="family-forms-container">
      <form onSubmit={handleSubmit} className="family-form">
        <h4>Unirse a una familia existente</h4>
        <div>
          <input
            type="text"
            placeholder="Introduce el ID de la familia"
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value)}
          />
        </div>
        <button type="submit">Unirse</button>
      </form>
    </div>
  );
}

export default JoinFamilyForm;
