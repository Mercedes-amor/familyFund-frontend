import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import GoalForm from "../components/GoalForm.jsx";
import GoalList from "../components/GoalList.jsx";
import { fetchWithAuth } from "../utils/fetchWithAuth";

//Estilos
import { ClipLoader, SyncLoader } from "react-spinners";
import "../GoalPage.css";

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
          fetchWithAuth(
            `http://localhost:8080/api/families/${familyId}/categories`,
            {
              headers: { Authorization: "Bearer " + token },
            }
          ),
          fetchWithAuth(`http://localhost:8080/api/goals/family/${familyId}`, {
            headers: { Authorization: "Bearer " + token },
          }),
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
  if (loading) {
    return (
      <div className="spinner-div">
        <SyncLoader color="#d4e2e1ff" size={15} />
      </div>
    );
  }
  if (!user) return <p>No hay usuario conectado</p>;

  // Calcular mes actual en formato YYYY-MM
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Objetivos por mes:

  //Obtenemos los objetivos por mes
  const goalsByMonth = goals.reduce((acc, goal) => {
    if (!acc[goal.month]) acc[goal.month] = [];
    acc[goal.month].push(goal);
    return acc;
  }, {});
  //Objetivos ordenados por mes
  const sortedMonths = Object.keys(goalsByMonth).sort((a, b) =>
    b.localeCompare(a)
  );

  //Objetivos pasados
  const historicalMonths = sortedMonths.filter((m) => m !== currentMonth);

  //Objetivos actuales
  const activeGoals = goals.filter((g) => g.month === currentMonth);

  //RENDERIZACIÓN
  return (
    <div className="cat-goal-wrapper">
      <h2 className="h2-goal-title">Objetivos de ahorro</h2>

          <GoalForm
            familyId={familyId}
            categories={categories}
            onGoalCreated={(newGoal) => setGoals((prev) => [...prev, newGoal])}
            token={token}
            selectedMonth={currentMonth}
          />
      <div className="goals-columns">
        {/* COLUMNA IZQUIERDA: HISTÓRICO DE MESES */}
        <div className="goals-card-col">
          <h2 style={{ color: "white", textAlign: "center" }}>
            Historial por meses
          </h2>

          {historicalMonths.map((month) => (
            <div key={month} className="month-block">
              <h3 style={{ color: "white" }}>{month}</h3>
              <GoalList goals={goalsByMonth[month]} readOnly />
            </div>
          ))}
        </div>

        {/* COLUMNA DERECHA: OBJETIVOS ACTUALES */}
        <div className="goals-card-col">
          <h2 style={{ textAlign: "center", color: "white" }}>
            Objetivos actuales 
          </h2>
          <h3 style={{ color: "white", textAlign:"center"}}>({currentMonth})</h3>
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

        </div>
      </div>
    </div>
  );
}
