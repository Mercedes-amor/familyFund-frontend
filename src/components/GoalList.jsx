import { useState } from "react";
import Swal from "sweetalert2";

//Librería iconos
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faEdit,
  faCheck,
  faXmark,
  faTrophy,
  faPiggyBank,
  faTrashArrowUp,
} from "@fortawesome/free-solid-svg-icons";

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
      console.log("data: " + data)
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
    <>
      {goals.map((goal) => (
        <div key={goal.id}>
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
              <div className="goal-divEdit-buttons">
                <button id="guardarButton" onClick={() => handleUpdate(goal)}>
                  Guardar
                </button>
                <button
                  id="cancelButton"
                  onClick={() => setEditingGoalId(null)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="wrapper_goals_card">
              <div className="goal_card">
                {goal.achieved ? (
                  <div style={{ textAlign: "center", padding: "25px" }}>
                    <FontAwesomeIcon
                      icon={faTrophy}
                      bounce
                      style={{
                        color: "#f1dd23ff",
                        fontSize: "4rem",
                      }}
                    />
                  </div>
                ) : goal.month < new Date().toISOString().slice(0, 7) ? (
                  <FontAwesomeIcon
                    icon={faXmark}
                    flip
                    style={{ color: "#ca0202", fontSize: "4rem" }}
                  />
                ) : (
                  <div style={{ textAlign: "center", padding: "25px" }}>
                    <FontAwesomeIcon
                      icon={faPiggyBank}
                      beat
                      style={{ color: "#e8f7faff", fontSize: "4rem" }}
                    />
                  </div>
                )}
                <div className="goal_card_columRight">
                  <h4>
                    <strong>Objetivo: </strong>
                    {goal.name}
                  </h4>

                  <h5>
                    <strong>Ahorrar: </strong>
                    {goal.amount}€ en {goal.categoryName}
                  </h5>

                  {!readOnly && (
                    <span className="spanEdit-buttons">
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{
                          cursor: "pointer",
                          marginLeft: "5px",
                        }}
                        onClick={() => handleEditClick(goal)}
                      />
                      <FontAwesomeIcon
                        icon={faTrashArrowUp}
                        style={{ cursor: "pointer", color: "#521005" }}
                        onClick={() => handleDelete(goal.id)}
                      />
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
