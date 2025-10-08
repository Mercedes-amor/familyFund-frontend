import { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useParams } from "react-router-dom";
import CategoryBar from "../components/CategoryBar";
import CategoryCompareChart from "../components/CategoryCompareChart";

//Estilos
import { ClipLoader, SyncLoader } from "react-spinners";

export default function CategoryCompare({ token }) {
  const [transactions, setTransactions] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams(); // Se pasa el id de la categoría por params

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!id || !token) return;

      try {
        setLoading(true);

        // Obtener transacciones
        const txEndpoint = `http://localhost:8080/api/categories/${id}/transactions`;
        const txRes = await fetchWithAuth(txEndpoint, {
          headers: { Authorization: "Bearer " + token },
        });
        const txData = await txRes.json();
        setTransactions(txData);

        // Obtener información de la categoría
        const catEndpoint = `http://localhost:8080/api/categories/${id}`;
        const catRes = await fetchWithAuth(catEndpoint, {
          headers: { Authorization: "Bearer " + token },
        });
        const catData = await catRes.json();
        setCategory(catData);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  // Función para convertir "YYYY-MM" en "Septiembre 2025"
  function formatMonth(monthString) {
    if (!monthString) return "";
    const [year, month] = monthString.split("-");
    const date = new Date(year, month - 1);
    const monthName = date.toLocaleString("es-ES", { month: "long" });
    return `${monthName} ${year}`; // sin "de"
  }

  if (loading)
    return (
      <div>
        <SyncLoader color="#24867d" size={15} />
      </div>
    );
  if (!transactions.length)
    return <p>No hay transacciones para esta categoría.</p>;

  // Agrupar por mes
  const groupedByMonth = transactions.reduce((acc, tx) => {
    const month = tx.date?.slice(0, 7);
    if (!acc[month]) acc[month] = [];
    acc[month].push(tx);
    return acc;
  }, {});

  return (
    <div className="cat-goal-wrapper">
      <h2 className="h2-title">{category?.name || "Categoría"}</h2>
      {Object.entries(groupedByMonth).map(([month, txs]) => (
        <div key={month} className="categories-div">
          <div
            className={`category-card ${
              category?.deleted ? "category-card-deleted" : ""
            }`}
          >
            <div className="category-header">
              <h3>{formatMonth(month)}</h3>
            </div>

            <ul className="transactions-list">
              {txs.map((tx) => (
                <li key={tx.id}>
                  {tx.name} — {tx.amount} €
                </li>
              ))}
            </ul>

            <CategoryBar
              total={txs.reduce((sum, t) => sum + t.amount, 0)}
              limit={category?.limit || 0}
            />
          </div>
        </div>
      ))}
      <CategoryCompareChart groupedByMonth={groupedByMonth} />

    </div>
  );
}
