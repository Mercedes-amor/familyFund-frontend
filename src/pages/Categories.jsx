import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function CategoriasPage() {
  const { user, userLoading } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados mostrar formulario transacción
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Estados nueva Transacción
  const [transactionName, setTransactionName] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");

  // Estados modificar transacción
  const [editTransactionId, setEditTransactionId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");

  // Estados editar categoría
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryLimit, setEditCategoryLimit] = useState("");

  const familyId = user?.family?.id;

  // CARGAR DATOS
  useEffect(() => {
    if (userLoading || !familyId) return;

    const fetchCategoriesWithTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        const categoriesRes = await fetch(
          `http://localhost:8080/api/families/${familyId}/categories`,
          { headers: { Authorization: "Bearer " + token } }
        );
        if (!categoriesRes.ok) throw new Error("Error al cargar categorías");
        const categoriesData = await categoriesRes.json();

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

  // ----- TRANSACCIONES -----
  const handleAddTransaction = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setShowTransactionForm(true);
    setTransactionName("");
    setTransactionAmount("");
  };

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
            date: new Date().toISOString().split("T")[0],
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al crear la transacción");
      }

      const newTx = await response.json();

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

  const handleEditClick = (tx) => {
    setEditTransactionId(tx.id);
    setEditName(tx.name);
    setEditAmount(tx.amount);
  };

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

  const handleDeleteTransaction = async (categoryId, txId) => {
    if (!window.confirm("¿Seguro que quieres borrar esta transacción?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/transactions/${txId}`,
        { method: "DELETE", headers: { Authorization: "Bearer " + token } }
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

  // ----- CATEGORÍAS -----
  const startEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setEditCategoryName(cat.name);
    setEditCategoryLimit(cat.limit ?? "");
  };

  const handleUpdateCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/categories/edit/${categoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            name: editCategoryName,
            limit: parseFloat(editCategoryLimit),
          }),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar categoría");

      const updatedCat = await response.json();

      setCategories((prev) =>
        prev.map((c) => (c.id === updatedCat.id ? updatedCat : c))
      );

      setEditingCategoryId(null);
    } catch (err) {
      alert(err.message);
    }
  };

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
        { method: "DELETE", headers: { Authorization: "Bearer " + token } }
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
  <div className="categories-div">

    {categories.map((category) => (
      <div key={category.id} className="category-wrapper">
        {/* Información de límite, total y porcentaje fuera de la tarjeta */}
        <div className="category-info">
          <strong>Límite:</strong> {category.limit ?? "∞"} € |{" "}
          <strong>Total:</strong> {category.totalSpent ?? 0} € |{" "}
          <strong>Porcentaje:</strong>{" "}
          {category.percentage ? category.percentage.toFixed(1) + "%" : "-"}
        </div>

        <div className="category-card">
          <div className="category-header">
            {editingCategoryId === category.id ? (
              <div className="category-edit-form">
                <input
                  type="text"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  required
                />
                <input
                  type="number"
                  value={editCategoryLimit}
                  onChange={(e) => setEditCategoryLimit(e.target.value)}
                  placeholder="Límite"
                  min="0"
                />
                <button onClick={() => handleUpdateCategory(category.id)}>
                  Guardar
                </button>
                <button onClick={() => setEditingCategoryId(null)}>
                  Cancelar
                </button>
              </div>
            ) : (
              <>
                <h3>{category.name}</h3>
                <div className="category-actions">
                  <button onClick={() => startEditCategory(category)}>✏️</button>
                  <button onClick={() => handleDeleteCategory(category.id)}>🗑️</button>
                </div>
              </>
            )}
          </div>

          <ul className="transactions-list">
            {category.transactions?.map((tx) => (
              <li key={tx.id}>
                {editTransactionId === tx.id ? (
                  <form
                    onSubmit={(e) => handleUpdateTransaction(category.id, tx.id, e)}
                    className="transaction-form"
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
                    <button type="submit">Guardar</button>
                    <button
                      type="button"
                      onClick={() => setEditTransactionId(null)}
                    >
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <div className="transaction-item">
                    {tx.name} - {tx.amount} €
                    <button onClick={() => handleEditClick(tx)}>✏️</button>
                    <button
                      onClick={() => handleDeleteTransaction(category.id, tx.id)}
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
      </div>
    ))}
</div>
    {showTransactionForm && (
      <div className="new-transaction-form">
        <h3>Nuevo gasto</h3>
        <form onSubmit={handleSubmitTransaction}>
          <input
            type="text"
            placeholder="Nombre"
            value={transactionName}
            onChange={(e) => setTransactionName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Importe"
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(e.target.value)}
            required
          />
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => setShowTransactionForm(false)}>
            Cancelar
          </button>
        </form>
      </div>
    )}
  </div>
);


}
