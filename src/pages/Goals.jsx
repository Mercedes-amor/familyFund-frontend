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
          fetchWithAuth(`http://localhost:8080/api/families/${familyId}/categories`, {
            headers: { Authorization: "Bearer " + token },
          }),
          fetchWithAuth(
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

  //RENDERIZACIÓN
  return (
    <div className="cat-goal-wrapper">
      <h2 className="h2-title">Objetivos de ahorro</h2>

      <div className="selectMonth-container">
        <label>Mes: </label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <div>
        {selectedMonth >= currentMonth ? (
          <div>
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

            <GoalForm
              familyId={familyId}
              categories={categories} // pasamos las categorías
              onGoalCreated={(newGoal) =>
                setGoals((prev) => [...prev, newGoal])
              }
              token={token}
              selectedMonth={selectedMonth}
            />
          </div>
        ) : (
          <div className="historico_goals_container">
            <div className="goals_card">
              {" "}
              <h3>Objetivos conseguidos</h3>
              <GoalList goals={achievedGoals} readOnly={true} />
            </div>

            <div className="goals_card" id="goal_no_archieved">
              {" "}
              <h3>Objetivos NO alcanzados</h3>
              <GoalList goals={failedGoals} readOnly={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
