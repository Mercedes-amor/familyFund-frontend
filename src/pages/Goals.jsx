import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import GoalForm from "../components/GoalForm.jsx";
import GoalList from "../components/GoalList.jsx";

export default function GoalsPage() {
  const { user, loading } = useContext(UserContext);
  const [goals, setGoals] = useState([]);
  const [categories, setCategories] = useState([]);
  //Estado del mes seleccionado
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const familyId = user?.family?.id;
  const token = localStorage.getItem("token");

  // Fetch objetivos y categorías
  useEffect(() => {
    if (!familyId) return;

    const fetchData = async () => {
      try {
        const [categoriesRes, goalsRes] = await Promise.all([
          fetch(`http://localhost:8080/api/families/${familyId}/categories`, {
            headers: { Authorization: "Bearer " + token },
          }),
          fetch(
            `http://localhost:8080/api/goals/family/${familyId}/month/${selectedMonth}`,
            {
              headers: { Authorization: "Bearer " + token },
            }
          ),
        ]);

        const categoriesData = await categoriesRes.json();
        const goalsData = await goalsRes.json();
        console.log("Categorías cargadas:", categoriesData);
        console.log("Goals cargados", goalsData);

        setCategories(categoriesData);
        setGoals(goalsData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [familyId, selectedMonth, token]);

  //Clausulas seguridad
  if (loading) return <p>Cargando...</p>;
  if (!user) return <p>No hay usuario conectado</p>;

  // Calcular mes actual en formato YYYY-MM
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Dividimos objetivos en:

  // Objetivos activos: del mes seleccionado o futuros, no conseguidos
  const activeGoals = goals.filter(
    (g) => !g.achieved && g.month >= currentMonth
  );

  // Objetivos conseguidos
  const achievedGoals = goals.filter((g) => g.achieved);

  // Objetivos pasados NO conseguidos
  const failedGoals = goals.filter(
    (g) => !g.achieved && g.month < currentMonth
  );

  return (
    <div className="goals-page-wrapper">
      <h2>Objetivos de ahorro</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>Mes: </label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <h3>Objetivos actuales</h3>
      <GoalList
        goals={activeGoals}
        onGoalUpdated={(updatedGoal) =>
          setGoals((prev) =>
            prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g))
          )
        }
        onGoalDeleted={(id) =>
          setGoals((prev) => prev.filter((g) => g.id !== id))
        }
        token={token}
      />

      <h3>HISTÓRICO: Objetivos conseguidos</h3>
      <GoalList goals={achievedGoals} readOnly={true} />

      <h3>HISTÓRICO: Objetivos NO conseguidos</h3>
      <GoalList goals={failedGoals} readOnly={true} />
    </div>
  );
}
