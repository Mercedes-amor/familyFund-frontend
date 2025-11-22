import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import DashboardChart from "../components/DashboardChart.jsx";
import InfoAPIWorldBank from "../components/InfoAPIWorldBank";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import MaxiGoal from "../components/MaxiGoal";
import DayQuote from "../components/DayQuote.jsx";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";

//Estilos
import { ClipLoader, SyncLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleRoof } from "@fortawesome/free-solid-svg-icons";
import "../Dashboard.css";
import DownloadExcelButton from "../components/ExcelBtn.jsx";

function Dashboard() {
  const { user, setUserLoading } = useContext(UserContext);
  const [family, setFamily] = useState({});
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado MaxiGoal
  const [maxiGoal, setMaxiGoal] = useState(null);
  const familyId = user?.family?.id;

  useEffect(() => {
    if (!familyId) return;

    fetchData();
  }, [familyId]);

  //------ FechData ------
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [
        familyRes,
        categoriesRes,
        transactionsRes,
        membersRes,
        savingsRes,
      ] = await Promise.all([
        fetchWithAuth(`http://localhost:8080/api/families/${familyId}`, {
          headers: { Authorization: "Bearer " + token },
        }),
        fetchWithAuth(
          `http://localhost:8080/api/families/${familyId}/categories`,
          { headers: { Authorization: "Bearer " + token } }
        ),
        fetchWithAuth(
          `http://localhost:8080/api/families/${familyId}/transactions`,
          { headers: { Authorization: "Bearer " + token } }
        ),
        fetchWithAuth(
          `http://localhost:8080/api/families/${familyId}/members`,
          { headers: { Authorization: "Bearer " + token } }
        ),
        fetchWithAuth(
          `http://localhost:8080/api/families/${familyId}/savings`,
          { headers: { Authorization: "Bearer " + token } }
        ),
      ]);

      if (
        !familyRes.ok ||
        !categoriesRes.ok ||
        !transactionsRes.ok ||
        !membersRes.ok ||
        !savingsRes.ok
      )
        throw new Error("Error cargando datos");

      const fetchedFamily = await familyRes.json();
      const fetchedCategories = await categoriesRes.json();
      const fetchedTransactions = await transactionsRes.json();
      const fetchedMembers = await membersRes.json();
      const fetchedSavings = await savingsRes.json();

      setFamily(fetchedFamily);
      setCategories(fetchedCategories);
      setTransactions(fetchedTransactions);
      setMembers(fetchedMembers);
      setMaxiGoal(fetchedFamily.maxiGoal);
      setSavings(fetchedSavings);

      console.log("fetchedFamily: " + fetchedFamily.maxiGoal.name);
      console.log(
        "fetchedFamily.maxiGoal.savings: " +
          fetchedFamily.maxiGoal.savings[0].usuarioId
      );

      // por defecto: toda la familia
      setSelectedMember(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  //------ FinFechData ------

  if (loading) {
    return (
      <div className="spinner-div">
        <SyncLoader color="#d4e2e1ff" size={15} />
      </div>
    );
  }

  if (!user) return <p>No hay usuario conectado</p>;

  // Obtener el mes actual en formato YYYY-MM
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Filtrar transacciones según usuario y mes
  const filteredTransactions = transactions.filter(
    (t) =>
      t.date?.slice(0, 7) === currentMonth &&
      (selectedMember === null || t.user?.id === selectedMember)
  );

  // ---- INGRESOS ----
  const ingresosCategory = categories.find((c) => c.name === "INGRESOS");
  const ingresosTransactions = filteredTransactions.filter(
    (t) => t.categoryId === ingresosCategory?.id && t.type === "INCOME"
  );
  const totalIngresos = ingresosTransactions
    .reduce((sum, t) => sum + t.amount, 0)
    .toFixed(2);

  // ---- GASTOS ----
  const gastosCategories = categories.filter((c) => c.name !== "INGRESOS");
  const gastosTotals = gastosCategories.map((c) => {
    const total = filteredTransactions
      .filter((t) => t.categoryId === c.id && t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0)
      .toFixed(2);
    return { ...c, total };
  });

  const totalGastos = gastosTotals
    .reduce((sum, c) => sum + parseFloat(c.total), 0)
    .toFixed(2);

  //---- AHORROS ----
  //--filtrados por mes---
  const ahorroMes =
    savings
      .filter(
        (s) => s.createAt && s.createAt.slice(0, 7) === currentMonth //comparar YYYY-MM
      )
      .reduce((sum, s) => sum + s.amount, 0) || 0;

  // Filtrar savings ahorro según usuario y mes
  const filteredSavings =
    savings
      .filter(
        (s) =>
          s.createAt?.slice(0, 7) === currentMonth &&
          (selectedMember === null || s.usuarioId === selectedMember)
      )
      .reduce((sum, s) => sum + s.amount, 0) || 0;

  //Clausulas seguridad mientras no cargan los datos.
  if (loading) {
    return (
      <div className="spinner-div">
        <SyncLoader color="#d4e2e1ff" size={15} />
      </div>
    );
  }

  //-------RENDER------
  return (
    <div className="dashboard-principal-container">
      <div className="sidebar">
        <h2>
          Familia <span>{family.name}</span>
        </h2>
        <MaxiGoal
          maxigoal={family?.maxiGoal}
          refreshData={fetchData}
          totalIngresosMes={totalIngresos}
          totalGastosMes={totalGastos}
          ahorroMes={ahorroMes}
          familyId={familyId}
        />
        {/*Miembros:*/}
        <ul className="members-list">
          {/*Opción para ver toda la familia*/}
          <li
            className={`family-item ${
              selectedMember === null ? "active-member" : ""
            }`}
            onClick={() => setSelectedMember(null)}
          >
            <FontAwesomeIcon
              icon={faPeopleRoof}
              style={{ color: "#00A6C4", fontSize: "3rem" }}
            />
          </li>
          {members.map((m) => (
            <li
              key={m.id}
              className={`member-item ${
                selectedMember === m.id ? "active-member" : ""
              }`}
              onClick={() => setSelectedMember(m.id)}
            >
              <img
                src={
                  m.photoUrl ||
                  "https://res.cloudinary.com/dz2owkkwa/image/upload/v1760687036/Familyfund/Dise%C3%B1o_sin_t%C3%ADtulo-removebg-preview_vqqzhb.png"
                }
                alt={m.nombre}
                className="member-photo"
              />
              <strong>{m.nombre}</strong> - {m.email}
            </li>
          ))}
        </ul>
        {/*Información bancaria:*/}
        <InfoAPIWorldBank />
      </div>

      <div className="dashboard-wrapper">
        <div className="categories-container">
          {/* INGRESOS */}
          <div className="dashBoard-card">
            <h3>INGRESOS</h3>
            {ingresosTransactions.length > 0 ? (
              <ul>
                {ingresosTransactions.map((t) => (
                  <li key={t.id}>
                    {t.name} - {t.amount} €
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay ingresos aún.</p>
            )}
          </div>

          {/* GASTOS */}
          <div className="dashBoard-card">
            <h3>GASTOS</h3>
            {gastosTotals.length > 0 ? (
              <ul>
                {gastosTotals.map((c) => (
                  <li key={c.id}>
                    {c.name} - {c.total} €
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay gastos aún.</p>
            )}
          </div>
        </div>

        {/* Totales */}
        <DashboardChart
          ingresos={parseFloat(totalIngresos)}
          gastos={parseFloat(totalGastos)}
          ahorro={parseFloat(filteredSavings)}
        />

        <DayQuote />
      </div>
    </div>
  );
}

export default Dashboard;
