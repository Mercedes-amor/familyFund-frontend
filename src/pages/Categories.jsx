import { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function CategoriasPage() {
  const { user, userLoading } = useContext(UserContext); //Usuario obtenido del UserContext
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const familyId = user?.family?.id; //Sacamos el familyId del contexto

  // Cargar categorías desde el backend
  useEffect(() => {
  if (userLoading || !user?.family?.id) return; // esperar a que user/family esté listo

  const fetchCategoriesWithTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const familyId = user.family.id;

      // Traer categorías
      const categoriesRes = await fetch(
        `http://localhost:8080/api/families/${familyId}/categories`,
        { headers: { Authorization: "Bearer " + token } }
      );
      if (!categoriesRes.ok) throw new Error("Error al cargar categorías");
      const categoriesData = await categoriesRes.json();

      // Traer transacciones por categoría
      const categoriesWithTx = await Promise.all(
        categoriesData.map(async (cat) => {
          const txRes = await fetch(
            `http://localhost:8080/api/families/${cat.id}/transactions`,
            { headers: { Authorization: "Bearer " + token } }
          );
          if (!txRes.ok) throw new Error("Error al cargar transacciones");
          const transactions = await txRes.json();
          return { ...cat, transactions };
        })
      );

      setCategories(categoriesWithTx);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchCategoriesWithTransactions();
}, [user, userLoading]);


  if (loading) return <p>Cargando categorías...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container">
      <h2>Categorías</h2>
      {categories.length === 0 ? (
        <p>No hay categorías.</p>
      ) : (
        categories.map((category) => (
          <div key={category.id} className="category-card">
            <h3>{category.name}</h3>
            {category.transactions && category.transactions.length > 0 ? (
              <ul>
                {category.transactions.map((tx) => (
                  <li key={tx.id}>
                    <span className="tx-name">{tx.name}</span>{" "}
                    <span className="tx-amount">{tx.amount} €</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay transacciones en esta categoría</p>
            )}
          </div>
        ))
      )}
      <style jsx>{`
        .container {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
        }
        .category-card {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
          background-color: #f9f9f9;
        }
        h2 {
          text-align: center;
          margin-bottom: 20px;
        }
        h3 {
          margin-bottom: 10px;
          color: #333;
        }
        ul {
          list-style: none;
          padding-left: 0;
        }
        li {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          border-bottom: 1px solid #eee;
        }
        li:last-child {
          border-bottom: none;
        }
        .tx-name {
          font-weight: 500;
        }
        .tx-amount {
          font-weight: bold;
          color: #2c7;
        }
      `}</style>
    </div>
  );
}
