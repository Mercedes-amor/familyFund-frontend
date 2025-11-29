import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "../GoalPage.css";

export default function GoalForm({
  familyId,
  categories,
  onGoalCreated,
  token,
  selectedMonth,
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !categoryId || !amount) {
      toast.warning("Rellena todos los campos");
      return;
    }

    const newGoal = {
      name,
      amount: parseFloat(amount),
      categoryId: parseInt(categoryId),
      familyId: familyId,
      month: selectedMonth,
      achieved: false,
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
        toast.error("Error al crear el objetivo");
        return;
      }

      const createdGoal = await res.json();
      onGoalCreated(createdGoal);

      // Reset
      setName("");
      setCategoryId("");
      setAmount("");
      setShowForm(false);

      Swal.fire({
        title: "¡Nuevo objetivo!",
        text: "Mucho ánimo para conseguir tus metas",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (err) {
      toast.error("Error de red al crear el objetivo");
    }
  };

  return (
    <div>
      {/* Botón flotante */}
      <button className="Add-goal-Button" onClick={() => setShowForm(true)}>
        ➕
      </button>

      {/* MODAL */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // evita cerrar al hacer click dentro
          >
            <h2 style={{ textAlign: "center", color: "white" }}>
              Nuevo objetivo
            </h2>

            <form onSubmit={handleSubmit} className="modal-form">
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

              <div className="modal-buttons">
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
