import { useState } from "react";
import Swal from "sweetalert2";

export default function GoalList({
  goals,
  onGoalUpdated,
  onGoalDeleted,
  readOnly,
}) {
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState(0);

  const handleEditClick = (goal) => {
    setEditingGoalId(goal.id);
    setEditName(goal.name);
    setEditAmount(goal.amount);
  };

  //PUT - Actualizar goal
  const handleUpdate = async (goal) => {
    try {
      const updatedGoal = {
        name: editName,
        amount: parseFloat(editAmount),
        categoryId: goal.categoryId,
        familyId: goal.familyId,
        month: goal.month,
        achieved: goal.achieved,
      };

      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/goals/${goal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(updatedGoal),
      });

      const data = await res.json();
      onGoalUpdated(data);
      setEditingGoalId(null);
    } catch (err) {
      console.error(err);
    }
  };

  //DELETE - Borrar goal
  const handleDelete = async (goalId) => {
    //Confirmación mediante Swal
        const result = await Swal.fire({
          title: "¿Estás seguro?",
          text: "Esta acción no se puede deshacer",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, borrar",
          cancelButtonText: "Cancelar",
          reverseButtons: true,
        });



     if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8080/api/goals/${goalId}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });

      onGoalDeleted(goalId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="goals_card">
      <p className="goal-list">
        {goals.map((goal) => (
          <p key={goal.id} className="goal-item">
            {editingGoalId === goal.id ? (
              <div className="goal-edit-form">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <input
                  type="number"
                  step="0.01"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                />
                <button onClick={() => handleUpdate(goal)}>Guardar</button>
                <button onClick={() => setEditingGoalId(null)}>Cancelar</button>
              </div>
            ) : (
              <div className="goal-info">
                {goal.achieved
                  ? "🏆 "
                  : goal.month < new Date().toISOString().slice(0, 7)
                  ? "❌ "
                  : "⏳ "}
                <strong>{goal.name}</strong>: Ahorra <strong>{goal.amount} € </strong> en {" "}
                 {goal.categoryName}
                
                {!readOnly && (
                  <span className="spanEdit-buttons">
                    <button onClick={() => handleEditClick(goal)}>✏️</button>
                    <button onClick={() => handleDelete(goal.id)}>🗑️</button>
                  </span>
                )}
              </div>
            )}
          </p>
        ))}
      </p>
    </div>
  );
}
