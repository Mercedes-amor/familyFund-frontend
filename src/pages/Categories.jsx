import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function CategoriasPage() {
  const { user, userLoading } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [transactionName, setTransactionName] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");

  //Estados modificar transaction
  const [editTransactionId, setEditTransactionId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");

  const familyId = user?.family?.id;

  // CARGAR DATOS
  // categorías y transacciones
  useEffect(() => {
    if (userLoading || !familyId) return;

    const fetchCategoriesWithTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

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
              `http://localhost:8080/api/categories/${cat.id}/transactions`,
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
  }, [user, userLoading, familyId]);

  //HANDLES

  //ACTUALIZAR ESTADOS AL AÑADIR TRANSACCIÓN
  const handleAddTransaction = (categoryId) => {
    setSelectedCategoryId(categoryId); //Id de la categoría a la que se le añadirá la transacción
    setShowTransactionForm(true); //Mostramos formulario
    setTransactionName(""); //Valores del formulario en blanco
    setTransactionAmount(""); //Valores del formulario en blanco
  };

  // NUEVA TRANSACCIÓN
  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/transactions/new/${selectedCategoryId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            name: transactionName,
            amount: parseFloat(transactionAmount),
            type: "EXPENSE",
            date: new Date().toISOString().split("T")[0], // yyyy-MM-dd
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al crear la transacción");
      }

      const newTx = await response.json();

      // Actualizar estado de categorías
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategoryId
            ? { ...cat, transactions: [...cat.transactions, newTx] }
            : cat
        )
      );

      setShowTransactionForm(false);
    } catch (err) {
      alert(err.message);
    }
  };

  //UPDATE TRANSACTION
  // Iniciar edición
  const handleEditClick = (tx) => {
    setEditTransactionId(tx.id);
    setEditName(tx.name);
    setEditAmount(tx.amount);
  };

  // Guardar edición
  const handleUpdateTransaction = async (categoryId, txId, e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/transactions/${txId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            name: editName,
            amount: parseFloat(editAmount),
            type: "EXPENSE",
            date: new Date().toISOString().split("T")[0],
          }),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar transacción");

      const updatedTx = await response.json();

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                transactions: cat.transactions.map((t) =>
                  t.id === updatedTx.id ? updatedTx : t
                ),
              }
            : cat
        )
      );

      setEditTransactionId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // BORRAR TRANSACCIÓN
  const handleDeleteTransaction = async (categoryId, txId) => {
    if (!window.confirm("¿Seguro que quieres borrar esta transacción?")) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/transactions/${txId}`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token },
        }
      );

      if (!response.ok) throw new Error("Error al borrar transacción");

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                transactions: cat.transactions.filter((t) => t.id !== txId),
              }
            : cat
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  //UPDATE CATEGORÍA
  const handleUpdateCategory = async (cat) => {
    const newName = prompt("Nuevo nombre de la categoría:", cat.name);
    if (!newName) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8080/api/categories/edit/${cat.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ name: newName }),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar categoría");

      const updatedCat = await res.json();
      setCategories((prev) =>
        prev.map((c) => (c.id === updatedCat.id ? updatedCat : c))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  //DELETE CATEGORÍA
  const handleDeleteCategory = async (catId) => {
    if (
      !window.confirm(
        "¿Seguro que quieres borrar la categoría y todas sus transacciones?"
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8080/api/categories/delete/${catId}`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token },
        }
      );

      if (!res.ok) throw new Error("Error al borrar categoría");

      setCategories((prev) => prev.filter((c) => c.id !== catId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Cargando categorías...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2 className="pageH2">Categorías</h2>
      <div className="categories-container">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <div className="category-header">
              <h3>{category.name}</h3>
              <div className="category-actions">
                <button
                  className="edit"
                  onClick={() => handleUpdateCategory(category)}
                >
                  ✏️
                </button>
                <button
                  className="delete"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  🗑️
                </button>
              </div>
            </div>

            <ul className="transactions-list">
              {category.transactions?.map((tx) => (
                <li key={tx.id}>
                  {editTransactionId === tx.id ? (
                    <form
                      className="transaction-form"
                      onSubmit={(e) =>
                        handleUpdateTransaction(category.id, tx.id, e)
                      }
                    >
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        required
                      />
                      <button type="submit" className="save">
                        Guardar
                      </button>
                      <button
                        type="button"
                        className="cancel"
                        onClick={() => setEditTransactionId(null)}
                      >
                        Cancelar
                      </button>
                    </form>
                  ) : (
                    <div className="category-actions">
                      {tx.name} - {tx.amount} €
                      <button
                        className="edit"
                        onClick={() => handleEditClick(tx)}
                      >
                        ✏️
                      </button>
                      <button
                        className="delete"
                        onClick={() =>
                          handleDeleteTransaction(category.id, tx.id)
                        }
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <button
              className="add-transaction-btn"
              onClick={() => handleAddTransaction(category.id)}
            >
              ➕ Añadir
            </button>
          </div>
        ))}
      </div>

      {showTransactionForm && (
        <div className="new-transaction-form">
          <h3>Nuevo gasto</h3>
          <form onSubmit={handleSubmitTransaction}>
            <div>
              <label>Nombre:</label>
              <input
                type="text"
                value={transactionName}
                onChange={(e) => setTransactionName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Importe:</label>
              <input
                type="number"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="save">
              Guardar
            </button>
            <button
              type="button"
              className="cancel"
              onClick={() => setShowTransactionForm(false)}
            >
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
