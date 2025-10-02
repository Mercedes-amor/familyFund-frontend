import { useState } from "react";

export default function GoalForm({ familyId, categories, onGoalCreated, token, selectedMonth }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !categoryId || !amount) {
      alert("Rellena todos los campos");
      return;
    }

    const newGoal = {
      name,
      amount: parseFloat(amount),
      categoryId: parseInt(categoryId),
      familyId: familyId,
      month: selectedMonth,
      achieved: false
    };

    try {
      const res = await fetch("http://localhost:8080/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(newGoal),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error creating goal:", errorData);
        alert("Error al crear el objetivo");
        return;
      }

      const createdGoal = await res.json();
      onGoalCreated(createdGoal);

      // Reset del formulario
      setName("");
      setCategoryId("");
      setAmount("");
      setShowForm(false);
    } catch (err) {
      console.error("Network error:", err);
      alert("Error de red al crear el objetivo");
    }
  };

  return (
    <div className="goal-form-wrapper" style={{ marginBottom: "20px" }}>
      {!showForm ? (
        <button onClick={() => setShowForm(true)}>➕ Nuevo objetivo</button>
      ) : (
        <form onSubmit={handleSubmit} className="divForm" style={{ marginTop: "10px" }}>
          <input
            type="text"
            placeholder="Nombre del objetivo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            {/* Nos aseguramos que categories es un array antes de renderizar */}
            <option value="">Selecciona categoría</option>
            {Array.isArray(categories) &&
              categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Límite: {c.limit} €)
                </option>
              ))}
          </select>

          <input
            type="number"
            placeholder="Cantidad a ahorrar"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
            required
          />

          <button type="submit">Guardar</button>
          <button type="button" onClick={() => setShowForm(false)}>Cancelar</button>
        </form>
      )}
    </div>
  );
}
