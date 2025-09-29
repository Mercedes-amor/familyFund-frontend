import { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Dashboard() {
  //Estados de Dashboard
  const { user, loading } = useContext(UserContext);
  const [family, setFamily] = useState({});
  const [members, setMembers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeFormCategory, setActiveFormCategory] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false); // Mostrar/ocultar form categoría

  const familyId = user?.family?.id;

  useEffect(() => {
    if (!familyId) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const familyRes = await fetch(
          `http://localhost:8080/api/families/${familyId}`,
          { headers: { Authorization: "Bearer " + token } }
        );
        if (!familyRes.ok) throw new Error("No autorizado");
        setFamily(await familyRes.json());

        const membersRes = await fetch(
          `http://localhost:8080/api/families/${familyId}/members`,
          { headers: { Authorization: "Bearer " + token } }
        );
        if (!membersRes.ok) throw new Error("No autorizado");
        setMembers(await membersRes.json());

        const categoriesRes = await fetch(
          `http://localhost:8080/api/families/${familyId}/categories`,
          { headers: { Authorization: "Bearer " + token } }
        );
        if (!categoriesRes.ok) throw new Error("No autorizado");
        setCategories(await categoriesRes.json());

        const transactionsRes = await fetch(
          `http://localhost:8080/api/families/${familyId}/transactions`,
          { headers: { Authorization: "Bearer " + token } }
        );
        if (!transactionsRes.ok) throw new Error("No autorizado");
        setTransactions(await transactionsRes.json());
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };

    fetchData();
  }, [familyId]);

  //FUNCIÓN AÑADIR TRANSACTION
  const handleTransactionSubmit = async (categoryId, e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const newTransaction = {
      name: formData.get("name"),
      amount: parseFloat(formData.get("amount")),
      type: "EXPENSE",
      date: new Date().toISOString().split("T")[0],
    };

    const res = await fetch(
      `http://localhost:8080/api/transactions/new/${categoryId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(newTransaction),
      }
    );

    if (res.ok) {
      const saved = await res.json();
      setTransactions((prev) => [...prev, saved]);
      setActiveFormCategory(null);
    } else {
      console.error("Error creating transaction");
    }
  };

  //FUNCIÓN AÑADIR CATEGORÍA
  const handleAddCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const newCategory = {
      name: formData.get("name"),
      limit: parseFloat(formData.get("limit")),
    };

    const res = await fetch(
      `http://localhost:8080/api/categories/newCategory/${familyId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(newCategory),
      }
    );

    if (res.ok) {
      const saved = await res.json();
      setCategories((prev) => [...prev, saved]);
      setShowCategoryForm(false); // ocultamos formulario
    } else {
      console.error("Error creando categoría");
    }
  };

  //Clausulas seguridad
  if (loading) return <p>Cargando usuario...</p>;
  if (!user) return <p>No hay usuario conectado</p>;

  return (
    <div>
      <h2>Familia: {family.name}</h2>

      {/* Miembros */}
      <h3>Miembros</h3>
      <ul>
        {members.map((u) => (
          <li key={u.id}>
            {u.nombre} - {u.email}
          </li>
        ))}
      </ul>

      {/* Categorías */}
      <h3>Categorías</h3>
      {categories.length > 0 ? (
        <ul className="categories-list">
          {categories.map((c) => (
            <li key={c.id} className="category-item">
              <span className="category-name">
                {c.name} (límite: {c.limit ?? "sin límite"})
              </span>
              <div className="category-actions">
                <button onClick={() => setActiveFormCategory(c.id)}>
                  ➕Añadir gasto
                </button>
              </div>

              {activeFormCategory === c.id && (
                <form
                  onSubmit={(e) => handleTransactionSubmit(c.id, e)}
                  style={{ marginTop: "5px", width: "100%" }}
                >
                  <input name="name" placeholder="Nombre" required />
                  <input
                    name="amount"
                    type="number"
                    placeholder="Importe"
                    step="0.01"
                    required
                  />
                  <button type="submit">Crear</button>
                  <button
                    type="button"
                    onClick={() => setActiveFormCategory(null)}
                  >
                    Cancelar
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay categorías todavía.</p>
      )}

      {/* Formulario nueva categoría */}
      {showCategoryForm ? (
        <form
          onSubmit={handleAddCategory}
          style={{ marginTop: "10px", display: "flex", gap: "10px" }}
        >
          <input name="name" placeholder="Nombre categoría" required />
          <input
            name="limit"
            type="number"
            placeholder="Límite (€)"
            step="0.01"
            required
          />
          <button type="submit">Crear</button>
          <button type="button" onClick={() => setShowCategoryForm(false)}>
            Cancelar
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowCategoryForm(true)}
          style={{
            marginTop: "10px",
            padding: "5px 10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ➕ Añadir categoría
        </button>
      )}

      {/* Transacciones */}
      <h3>Transacciones</h3>
      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.name} - {t.amount} - {t.type} - {t.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
