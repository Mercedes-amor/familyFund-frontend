import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import DashboardChart from "../components/DashboardChart.jsx";
import InfoAPIWorldBank from "../components/InfoAPIWorldBank";

import DayQuote from "../components/DayQuote.jsx";

//Estilos
import { ClipLoader, SyncLoader } from "react-spinners";
import "../Dashboard.css";

function Dashboard() {
  const { user, loading } = useContext(UserContext);
  const [family, setFamily] = useState({});
  const [members, setMembers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const familyId = user?.family?.id;

  useEffect(() => {
    if (!familyId) return;

    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const [familyRes, categoriesRes, transactionsRes, membersRes] =
          await Promise.all([
            fetch(`http://localhost:8080/api/families/${familyId}`, {
              headers: { Authorization: "Bearer " + token },
            }),
            fetch(`http://localhost:8080/api/families/${familyId}/categories`, {
              headers: { Authorization: "Bearer " + token },
            }),
            fetch(
              `http://localhost:8080/api/families/${familyId}/transactions`,
              { headers: { Authorization: "Bearer " + token } }
            ),
            fetch(`http://localhost:8080/api/families/${familyId}/members`, {
              headers: { Authorization: "Bearer " + token },
            }),
          ]);

        if (
          !familyRes.ok ||
          !categoriesRes.ok ||
          !transactionsRes.ok ||
          !membersRes.ok
        )
          throw new Error("Error cargando datos");

        setFamily(await familyRes.json());
        setCategories(await categoriesRes.json());
        setTransactions(await transactionsRes.json());
        setMembers(await membersRes.json()); // <-- aquí guardamos los miembros
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [familyId]);

  
    if (loading) {
    return (
      <div>
        <SyncLoader color="#24867d" size={15} />
      </div>
    )
  }
  if (!user) return <p>No hay usuario conectado</p>;

  // Obtener el mes actual en formato YYYY-MM
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Filtrar transacciones del mes actual
  const monthlyTransactions = transactions.filter(
    (t) => t.date && t.date.slice(0, 7) === currentMonth
  );

  // Obtener categoría INGRESOS
  const ingresosCategory = categories.find((c) => c.name === "INGRESOS");
  const ingresosTransactions = monthlyTransactions.filter(
    (t) => t.categoryId === ingresosCategory?.id && t.type === "INCOME"
  );
  const totalIngresos = ingresosTransactions
    .reduce((sum, t) => sum + t.amount, 0)
    .toFixed(2);

  // Obtener categorías de GASTOS
  const gastosCategories = categories.filter((c) => c.name !== "INGRESOS");
  const gastosTotals = gastosCategories.map((c) => {
    const total = monthlyTransactions
      .filter((t) => t.categoryId === c.id && t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0)
      .toFixed(2);
    return { ...c, total };
  });
  const totalGastos = gastosTotals
    .reduce((sum, c) => sum + parseFloat(c.total), 0)
    .toFixed(2);

  return (
    <div className="dashboard-principal-container">
      <div className="dashboard-barra">
        <h2>Familia: {family.name}</h2>
        <h3>Miembros de la familia</h3>
        <ul className="members-list">
          {members.map((m) => (
            <li key={m.id} className="member-item">
              <strong>{m.nombre}</strong> - {m.email}
            </li>
          ))}
        </ul>
        <InfoAPIWorldBank />
      </div>
      <div className="dashboard-wrapper">
        <div className="categories-container">
          {/* TARJETA INGRESOS */}
          <div className="category-card">
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

          {/* TARJETA GASTOS */}
          <div className="category-card">
            <h3>GASTOS</h3>
            {gastosTotals.length > 0 ? (
              <ul>
                {gastosTotals.map((c) => (
                  <li key={c.id}>
                    {c.name} - Total: {c.total} €
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay gastos aún.</p>
            )}
          </div>
        </div>

        {/* Totales */}
        <div style={{ marginTop: "20px" }}>
          <p>
            <strong>Total INGRESOS:</strong> {totalIngresos} €
          </p>
          <p>
            <strong>Total GASTOS:</strong> {totalGastos} €
          </p>
        </div>
        <h3>Ingresos vs Gastos</h3>
        <DashboardChart
          ingresos={parseFloat(totalIngresos)}
          gastos={parseFloat(totalGastos)}
        />
        <DayQuote/>
      </div>
    </div>
  );
}

export default Dashboard;
