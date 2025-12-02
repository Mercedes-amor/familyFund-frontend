import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

//Estilos
import "../MaxiGoal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faEdit,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

//Animación monedas
const launchCoins = () => {
  const container = document.querySelector(".coins-animation-container");
  if (!container) return;

  for (let i = 0; i < 10; i++) {
    const coin = document.createElement("div");
    coin.classList.add("coin");
    coin.style.left = `${30 + Math.random() * 40}%`;
    coin.style.animationDelay = `${i * 0.1}s`;
    container.appendChild(coin);
    setTimeout(() => coin.remove(), 1200);
  }
};

export default function MaxiGoal({
  maxigoal,
  familyId,
  refreshData,
  totalGastosMes,
  totalIngresosMes,
  ahorroMes,
}) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // estados para edición
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(maxigoal.name);
  const [editTarget, setEditTarget] = useState(maxigoal.targetAmount);

  if (!maxigoal) return null;

  const actual = Number(maxigoal.actualSave ?? 0);
  const target = Number(maxigoal.targetAmount ?? 0) || 1;
  const percentage = Math.min((actual / target) * 100, 100);

  const handleAddSaving = async (e) => {
    e?.preventDefault();
    setError(null);

    const value = parseFloat(saving);
    if (isNaN(value) || value <= 0) {
      setError("Introduce una cantidad válida mayor que 0");
      return;
    }

    // Fondos disponibles para ahorrar
    const fondosDisponibles = totalIngresosMes - totalGastosMes - ahorroMes;

    if (value > fondosDisponibles) {
      setError(
        `No puedes ahorrar más de la cantidad disponible: ${fondosDisponibles.toFixed(
          2
        )}€`
      );
      toast.error("No tienes tantos fondos disponibles");

      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8080/api/families/maxigoal/${
          maxigoal.id
        }/add-saving?amount=${encodeURIComponent(value)}`,
        { method: "POST", headers: { Authorization: "Bearer " + token } }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error al añadir ahorro");
      }

      launchCoins();
      setSaving("");
      // Si el objetivo se cumple, animación y esperar antes de refrescar
      if (actual + value >= target) {
        triggerGoalAchievedAnimation();
        setTimeout(async () => {
          if (typeof refreshData === "function") await refreshData();
        }, 1500); // tiempo de la animación
      } else {
        // Si no se cumple, refresh normal
        if (typeof refreshData === "function") await refreshData();
      }
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8080/api/families/maxigoal/${maxigoal.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            name: editName,
            targetAmount: parseFloat(editTarget),
          }),
        }
      );
      if (!res.ok) throw new Error("Error al actualizar MaxiGoal");
      setIsEditing(false);
      if (typeof refreshData === "function") await refreshData();
    } catch (err) {
      setError(err.message || "Error al guardar cambios");
    }
  };

  //Animación al alcanzar objetivo
  const triggerGoalAchievedAnimation = () => {
    const piggy = document.querySelector(".piggy-wrapper");
    const bar = document.querySelector(".piggy-bar");

    if (piggy) {
      piggy.classList.add("goal-achieved-shake");
      setTimeout(() => piggy.classList.remove("goal-achieved-shake"), 1200);
    }
    if (bar) {
      bar.classList.add("goal-achieved-glow");
      setTimeout(() => bar.classList.remove("goal-achieved-glow"), 1500);
    }

    // Popup de ENHORABUENA con SweetAlert2
    Swal.fire({
      title: "🎉 ¡Objetivo alcanzado! 🎉",
      text: "Has logrado el máximo objetivo. ¡Sigue así!",
      icon: "success",
      confirmButtonText: "¡Genial!",
      timer: 3500,
      timerProgressBar: true,
      backdrop: `
      rgba(0,0,0,0.4)
      left top
      no-repeat
    `,
    });
    // Confetti
    for (let i = 0; i < 25; i++) {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti-piece");
      confetti.style.left = `${10 + Math.random() * 80}%`;
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 90%, 60%)`;
      confetti.style.animationDelay = `${Math.random() * 0.4}s`;

      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 1500);
    }
  };

  useEffect(() => {
    if (actual >= target) {
      triggerGoalAchievedAnimation();
    }
  }, [actual, target]);

  console.log("actual:", actual, "target:", target);

  return (
    <div className="maxigoal-container">
      {/* Título */}
      <h3 className="maxi-title">
        {maxigoal.name ?? "MaxiGoal"}{" "}
        <FontAwesomeIcon
          icon={faEdit}
          style={{ cursor: "pointer", fontSize: "0.8rem", marginLeft: "5px" }}
          onClick={() => setIsEditing(true)}
        />
      </h3>

      {/* Modal de edición */}
      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>Editar MaxiGoal</h4>
            <form className="modal-form">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Nombre del MaxiGoal"
              />
              <input
                type="number"
                step="0.01"
                min="0"
                value={editTarget}
                onChange={(e) => setEditTarget(e.target.value)}
                placeholder="Objetivo (€)"
              />
              <div className="modal-buttons">
                <button type="button" onClick={handleSaveEdit}>
                  Guardar
                </button>
                <button type="button" onClick={() => setIsEditing(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barra y monedas */}
      <div
        className="piggy-wrapper"
        onClick={() => {
          navigate(`/savings-list/${familyId}`);
        }}
        style={{ cursor: "pointer" }}
      >
        <div className="piggy-bar" style={{ height: `${percentage}%` }}></div>
        <div className="coins-animation-container"></div>
        <img src="/images/piggy-eyes.png" className="piggy-eyes" alt="" />
      </div>

      {/* Estadísticas */}
      <p className="maxi-stats">
        <strong>{actual.toFixed(2)}€</strong> / {target.toFixed(2)}€ —{" "}
        {Math.round(percentage)}%
      </p>

      {/* Formulario de ahorro */}
      <form onSubmit={handleAddSaving} className="maxi-form">
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Importe"
          value={saving}
          onChange={(e) => setSaving(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          <FontAwesomeIcon
            icon={faCoins}
            style={{
              color: "#ffe68dff",
              fontSize: "2rem",
              paddingRight: "15px",
            }}
          />
          <span style={{ fontSize: loading ? "0.9em" : "1.1em" }}>
            {loading ? "Sumando..." : "¡ Ahorra !"}
          </span>
        </button>
      </form>

      {error && <div className="maxi-error">{error}</div>}
    </div>
  );
}
