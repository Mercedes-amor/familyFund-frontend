import { useState } from "react";

export default function FamilyForm({ userId, onFamilyCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/families/newfamily?userId=${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al crear la familia");
      }

      const newFamily = await response.json();
      setSuccess("Familia creada correctamente");
      setName("");
      setDescription("");

      // Explicación de esta parte:
      // onFamilyCreated es una función opcional pasada desde Profile.
      // Si existe, se llama con la nueva familia creada para actualizar la lista en el padre.
      if (onFamilyCreated) {
        onFamilyCreated(newFamily);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="divForm-container">
      <h3>Crear Nueva Familia</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit} className="divForm">
        <div>
          <label>Nombre de la familia:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Descripción:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit">Crear Familia</button>
      </form>
    </div>
  );
}
