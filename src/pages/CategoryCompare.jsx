import { useEffect, useState, useContext } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import CategoryBar from "../components/CategoryBar";
import CategoryCompareChart from "../components/CategoryCompareChart";
import { SyncLoader } from "react-spinners";

import "../CategoryComparePage.css";
import "../CategoriesPage.css";

export default function CategoryCompare({ token }) {
  const { user, userLoading } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const familyId = user?.family?.id;

  // Obtener todas las categorías de la familia
  useEffect(() => {
    const fetchCategories = async () => {
      if (!familyId) return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetchWithAuth(
          `http://localhost:8080/api/families/${familyId}/categories/history`,
          { headers: { Authorization: "Bearer " + token } }
        );
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };
    fetchCategories();
  }, [familyId]);

  // Obtener transacciones e info de la categoría seleccionada
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const categoryId = selectedCategoryId || id;
      if (!categoryId || !token) return;

      try {
        setLoading(true);

        const txEndpoint = `http://localhost:8080/api/categories/${categoryId}/transactions`;
        const txRes = await fetchWithAuth(txEndpoint, {
          headers: { Authorization: "Bearer " + token },
        });
        const txData = await txRes.json();
        console.log("Transacciones recibidas:", txData);

        setTransactions(txData || []);

        const catEndpoint = `http://localhost:8080/api/categories/${categoryId}`;
        const catRes = await fetchWithAuth(catEndpoint, {
          headers: { Authorization: "Bearer " + token },
        });
        const catData = await catRes.json();
        setCategory(catData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, selectedCategoryId, token]);

  // Cambio de categoría desde el select
  const handleCategoryChange = (e) => {
    const newId = e.target.value;
    setSelectedCategoryId(newId);
    navigate(`/category-compare/${newId}`);
  };

  //Formatear visualización mes
  function formatMonth(monthString) {
    if (!monthString) return "";
    const [year, month] = monthString.split("-");
    const date = new Date(year, month - 1);
    const monthName = date.toLocaleString("es-ES", { month: "long" });
    return `${monthName} ${year}`;
  }

  if (loading)
    return (
      <div className="spinner-div">
        <SyncLoader color="#d4e2e1ff" size={15} />
      </div>
    );

  //Calcular total transacciones por mes
  const groupedByMonth = transactions.reduce((acc, tx) => {
    const month = tx.date?.slice(0, 7);
    if (!acc[month]) acc[month] = [];
    acc[month].push(tx);
    return acc;
  }, {});

  return (
    <div className="compare-wrapper">
      <div className="Title-Volver-wrapper">
        <h2 className="h2-title">{category?.name || "Categoría"}</h2>
        <button onClick={() => navigate(-1)} className="btn-volver">
          Volver
        </button>
      </div>

      <div className="Title-Volver-wrapper">
        <CategoryCompareChart groupedByMonth={groupedByMonth} />
      </div>

      <div className="selectMonth-wrapper">
        <div className="selectMonth-container">
          <label id="categorySelect-label" htmlFor="categorySelect">
            Categorías:{" "}
          </label>
          <select
            id="categorySelect"
            value={selectedCategoryId || id}
            onChange={handleCategoryChange}
          >
            {categories.map((cat) => (
              <option
                key={cat.id}
                value={cat.id}
                style={{ color: cat.deleted ? "red" : "black" }}
              >
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="compare-div-wrapper">
        <div className="compare-div">
          {Object.keys(groupedByMonth).length > 0 ? (
            Object.entries(groupedByMonth)
              .sort(
                ([monthA], [monthB]) =>
                  Number(monthB.replace("-", "")) -
                  Number(monthA.replace("-", ""))
              ) // de más reciente a más antiguo
              .map(([month, txs]) => (
                <div key={month}>
                  <div
                    className={`category-card ${
                      category?.deleted ? "category-card-deleted" : ""
                    }`}
                  >
                    <div className="categoryCompare-header">
                      <h3>{formatMonth(month)}</h3>
                    </div>

                    <ul className="transactions-list">
                      {txs.length > 0 ? (
                        txs.map((tx) => (
                          <li key={tx.id}>
                            <div className="transaction-item">
                              <span className="tx-name">{tx.name}</span>
                              <span className="tx-amount">{tx.amount} €</span>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li>No hay transacciones</li>
                      )}
                    </ul>
                    <div className="charCompare">
                      <CategoryBar
                        total={txs.reduce((sum, t) => sum + t.amount, 0)}
                        limit={category?.limit || 0}
                      />
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div
              className={`category-card ${
                category?.deleted ? "category-card-deleted" : ""
              }`}
            >
              <div className="categoryCompare-header">
                <h3>{category?.name}</h3>
              </div>

              <ul className="transactions-list">
                <li>No hay transacciones</li>
              </ul>
              <div className="charCompare">
                <CategoryBar total={0} limit={category?.limit || 0} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
