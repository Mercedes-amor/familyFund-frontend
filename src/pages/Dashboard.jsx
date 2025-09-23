import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  // Estados de la página
  const [family, setFamily] = useState(null); // Datos de la familia del usuario
  const [categories, setCategories] = useState([]); // Categorías de la familia
  const [transactions, setTransactions] = useState([]); // Transacciones de cada categoría
  const [loading, setLoading] = useState(true); // Estado de carga
  const [activeFormCategory, setActiveFormCategory] = useState(null); // Control del formulario new Transaction

  const token = localStorage.getItem("token"); // Token JWT almacenado tras login
  const userId = localStorage.getItem("userId"); // ID del usuario logueado

  //Comienza el useEffect
  useEffect(() => {
    if (!token || !userId) return; //Validamos si está el usuario logueado con su id y Token

    //FUNCIÓN OBTENER USUARIO LOGUEADO, SU FAMILIA Y SUS CATEGORÍAS
    const fetchUserAndCategories = async () => {
      try {
        // Obtenemos datos del usuario
        const resUser = await axios.get(
          `http://localhost:8080/api/auth/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const userData = resUser.data;
        setFamily(userData.family); //Actualizamos familia del usuario

        // Si tiene familia, obtener categorías de esa familia
        if (userData.family) {
          const resCat = await axios.get(
            `/api/categories/list/${userData.family.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          // Aseguramos que sea array y reemplazamos todo el estado
          setCategories(Array.isArray(resCat.data) ? resCat.data : []);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
        setCategories([]);
      } finally {
        setLoading(false); //Finalmente cambios el estado setLoading a false
      }
    };

    fetchUserAndCategories(); //Ejecutamos la función
  }, [token, userId]);

  //HANDLES

  //NEW CATEGORY
  const handleAddCategory = async () => {
    const name = prompt("Introduce el nombre de la nueva categoría:");
    if (!name) return;

    try {
      const res = await axios.post(
        `http://localhost:8080/api/categories/newCategory/${family.id}`,
        { name },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Añadimos solo la nueva categoría al estado
      setCategories((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error creando categoría:", err);
      alert("No se pudo crear la categoría. Revisa la consola.");
    }
  };

  //NEW TRANSACTION
  const handleTransactionSubmit = async (categoryId, e) => {
    e.preventDefault(); //Evitar que se envíe directamente
    const form = e.target;
    const name = form.name.value.trim();
    const amount = parseFloat(form.amount.value);

    //Clausula de control de datos
    if (!name || isNaN(amount) || amount <= 0) {
      alert("Datos inválidos");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8080/api/transactions/new/${categoryId}`,
        {
          name,
          amount,
          type: "EXPENSE", //Siempre será gasto desde este formulario
          date: new Date().toISOString().split("T")[0], //Pasamos fecha actual del sistema
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactions([...transactions, res.data]); //Añadimos la transacton al Array
      setActiveFormCategory(null); // Ocultamos el formulario tras crear
    } catch (err) {
      console.error("Error creando transacción:", err);
      alert("No se pudo crear la transacción. Revisar consola.");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!family) return <p>No perteneces a ninguna familia todavía.</p>;

  return (
    <div>
      <h2>Familia: {family.name}</h2>

      {/*Listado de usuarios de la Familia*/}
      <h3>Miembros</h3>
      <ul>
        {family.usuarios?.map((u) => (
          <li key={u.id}>
            {u.nombre} - {u.email}
          </li>
        ))}
      </ul>

      {/*Listado de Categorías de la Familia*/}
      <h3>Categorías</h3>
      {categories.length > 0 ? (
        <ul>
          {categories.map((c) => (
            <li key={c.id}>
              {c.name}{" "}
              <button onClick={() => setActiveFormCategory(c.id)}>
                ➕ Añadir transacción
              </button>
              {/* Formulario para añadir transacción */}
              {activeFormCategory === c.id && (
                <form
                  onSubmit={(e) => handleTransactionSubmit(c.id, e)}
                  style={{ marginTop: "5px" }}
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

      {/* BOTÓN NUEVA CATEGORÍA */}
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
