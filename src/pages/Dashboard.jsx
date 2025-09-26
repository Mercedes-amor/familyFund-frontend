import { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Dashboard() {
  //Estados de Dashboard
  const { user, loading } = useContext(UserContext); //Usuario obtenido del UserContext
  const [family, setFamily] = useState({});
  const [members, setMembers] = useState([]); //Usuarios de la familia
  const [categories, setCategories] = useState([]); //Categorías de la familia
  const [transactions, setTransactions] = useState([]); //Tansacciones de las categorías de la familia
  const [activeFormCategory, setActiveFormCategory] = useState(null); //Mostrar/ocultar FormCategory

  const familyId = user?.family?.id; //Sacamos el familyId del contexto

  useEffect(() => {
    if (!familyId) return; // aún no tenemos usuario o familia

    //FUNCIÓN OBTENER DATA DE LA FAMILIA
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); //Obtenemos token JWT

        const familyRes = await fetch(
          `http://localhost:8080/api/families/${familyId}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (!familyRes.ok) throw new Error("No autorizado");
        setFamily(await familyRes.json());

        const membersRes = await fetch(
          `http://localhost:8080/api/families/${familyId}/members`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (!membersRes.ok) throw new Error("No autorizado");
        setMembers(await membersRes.json());

        const categoriesRes = await fetch(
          `http://localhost:8080/api/families/${familyId}/categories`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (!categoriesRes.ok) throw new Error("No autorizado");
        setCategories(await categoriesRes.json());

        const transactionsRes = await fetch(
          `http://localhost:8080/api/families/${familyId}/transactions`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (!transactionsRes.ok) throw new Error("No autorizado");
        setTransactions(await transactionsRes.json());
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };

    fetchData();
  }, [familyId]);

  //HANDLES

  //FUNCIÓN AÑADIR TRANSACTION
  const handleTransactionSubmit = async (categoryId, e) => {
    e.preventDefault(); //Evitamos el submit directo
    const formData = new FormData(e.target);

    const newTransaction = {
      name: formData.get("name"),
      amount: parseFloat(formData.get("amount")),
      type: "EXPENSE",
      date: new Date().toISOString().split("T")[0], // yyyy-MM-dd
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
      setTransactions((prev) => [...prev, saved]); //Añadimos nueva transaction al array
      setActiveFormCategory(null); //ocultamos el formulario
    } else {
      console.error("Error creating transaction");
    }
  };

  //FUNCIÓN AÑADIR CATEGORÍA
  const handleAddCategory = async () => {
    const name = prompt("Nombre de la nueva categoría:");
    if (!name) return;

    const res = await fetch(
      `http://localhost:8080/api/categories/newCategory/${familyId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ name }),
      }
    );

    if (res.ok) {
      const saved = await res.json();
      setCategories((prev) => [...prev, saved]);
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
              <span className="category-name">{c.name}</span>
              <div className="category-actions">
                <button onClick={() => setActiveFormCategory(c.id)}>➕Añadir gasto</button>
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

      {/* Botón nueva categoría */}
      <button
        onClick={handleAddCategory}
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
