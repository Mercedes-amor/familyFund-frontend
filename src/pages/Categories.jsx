import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import CatActualList from "../components/CatActualList";
import CatHistorico from "../components/CatHistorico";
import { ToastContainer, toast } from "react-toastify";

//Estilos
import { ClipLoader, SyncLoader } from "react-spinners";
import "../CategoriesPage.css";

export default function CategoriasPage() {
  const { user, userLoading } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados mostrar formularios categoría y transacción
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

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

  // Estado para el mes selecionado para visualización
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    // Guardamos mes actual en formato YYYY-MM.
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  // Calcular mes actual en formato YYYY-MM
  const currentMonth = new Date().toISOString().slice(0, 7);

  //Obtenemos el id de la familia del usuario logueado
  //User podría ser undefined o null, si user existe acceder a familia
  //Si user.family existe acceder a id
  //Si alguno es null o undefine no lanza error, devuelve undefined
  const familyId = user?.family?.id; //?--> encadenamiento opcional

  // CARGAR DATOS
  useEffect(() => {
    if (userLoading || !familyId) return;

    //Establecemos la ruta, ya que si vemos la del mes actual no debe mostrarnos las categorías borradas
    const endpoint =
      selectedMonth === currentMonth
        ? `http://localhost:8080/api/families/${familyId}/categories`
        : `http://localhost:8080/api/families/${familyId}/categories/history`;

    const fetchCategoriesWithTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        //Primero obtenemos las categorías de la familia
        const categoriesRes = await fetchWithAuth(endpoint, {
          headers: { Authorization: "Bearer " + token },
        });

        if (!categoriesRes.ok) throw new Error("Error al cargar categorías");
        const categoriesData = await categoriesRes.json();

        //Ahora con un map obtenemos las transacciones de cada categoría filtradas por mes
        const categoriesWithTx = await Promise.all(
          categoriesData.map(async (cat) => {
            const txRes = await fetchWithAuth(
              `http://localhost:8080/api/categories/${cat.id}/transactions`,
              { headers: { Authorization: "Bearer " + token } }
            );

            // console.log(categoriesData);

            if (!txRes.ok) throw new Error("Error al cargar transacciones");
            const transactions = await txRes.json();
            return { ...cat, transactions };
          })
        );

        //En el estado cargamos las categorías con sus transacciones
        setCategories(categoriesWithTx);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesWithTransactions();
  }, [user, userLoading, familyId, selectedMonth]);

  // ----- TRANSACCIONES -----
  const handleAddTransaction = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setShowTransactionForm(true);
    setTransactionName("");
    setTransactionAmount("");
  };

  //Crear transacción (Ingreso o gasto)
  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Buscar la categoría seleccionada
      const category = categories.find((cat) => cat.id === selectedCategoryId);
      if (!category) throw new Error("Categoría no encontrada");

      // Determinamos ingreso o gasto según el nombre de la categoría
      const txType =
        category.name.toUpperCase() === "INGRESOS" ? "INCOME" : "EXPENSE";

      //POST - Crear transacción
      const response = await fetchWithAuth(
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
            type: txType,
            date: new Date().toISOString().split("T")[0],
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al crear la transacción");
      }

      const newTx = await response.json();

      //Actualizamos el estado de la categoría después de añadirle una transacción nueva
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategoryId
            ? { ...cat, transactions: [...cat.transactions, newTx] }
            : cat
        )
      );
      //Ocultamos el formulario al finalizar
      setShowTransactionForm(false);
    } catch (err) {
      alert(err.message);
      toast.error(err.message);
    }
  };

  const handleEditClick = (tx) => {
    setEditTransactionId(tx.id);
    setEditName(tx.name);
    setEditAmount(tx.amount);
  };

  //PUT - Actualizar transacción
  const handleUpdateTransaction = async (categoryId, txId, e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetchWithAuth(
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
      // alert(err.message);
      toast.error(err.message);
    }
  };
  //DELETE - Borrar transacción
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
      // alert(err.message);
      toast.error(err.message);
    }
  };

  // ----- CATEGORÍAS -----
  const startEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setEditCategoryName(cat.name);
    setEditCategoryLimit(cat.limit ?? "");
  };
  // POST - Crear nueva categoría
  const handleAddCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCategory = {
      name: formData.get("name"),
      limit: parseFloat(formData.get("limit")),
    };

    try {
      const res = await fetchWithAuth(
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

      if (!res.ok) throw new Error("Error creando categoría");

      const saved = await res.json();
      //Actualizamos el estado añadiendo la nueva categoría
      setCategories((prev) => [...prev, saved]);
      setShowCategoryForm(false);
    } catch (err) {
      console.error(err.message);
    }
  };
  // PUT - Actualizar categoría
  const handleUpdateCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetchWithAuth(
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
        prev.map((c) =>
          c.id === updatedCat.id
            ? { ...updatedCat, transactions: c.transactions || [] } // preservamos las transacciones
            : c
        )
      );

      setEditingCategoryId(null);
    } catch (err) {
      // alert(err.message);
      toast.error(err.message);
    }
  };

  // DELETE - Borrar categoría
  const handleDeleteCategory = async (catId) => {
    if (
      !window.confirm(
        "¿Seguro que quieres borrar la categoría las transacciones de este mes?"
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetchWithAuth(
        `http://localhost:8080/api/categories/delete/${catId}`,
        { method: "DELETE", headers: { Authorization: "Bearer " + token } }
      );
      if (!res.ok) throw new Error("Error al borrar categoría");
      setCategories((prev) => prev.filter((c) => c.id !== catId));
    } catch (err) {
      // alert(err.message);
      toast.error(err.message);
    }
  };

  //Clausulas seguridad mientras no cargan los datos.
  if (loading) {
    return (
      <div className="spinner-div">
        <SyncLoader color="#d4e2e1ff" size={15} />
      </div>
    );
  }
  //Etiqueta para errores en los fetch
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  //RENDERIZACIÓN
  return (
    <div className="cat-goal-wrapper">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        style={{ marginTop: "70px", zIndex: 9999 }}
      />
      <h2 className="h2-title">Categorías</h2>

      <div className="selectMonth-container">
        <label>Mes: </label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>
      {/* Si el selectMonth es el mes actual renderizamos el componente 
CatActualList mandando como props todos los estados y métodos/*} */}
      {selectedMonth === currentMonth ? (
        <CatActualList
          categories={categories}
          selectedMonth={selectedMonth}
          showTransactionForm={showTransactionForm}
          selectedCategoryId={selectedCategoryId}
          transactionName={transactionName}
          transactionAmount={transactionAmount}
          editTransactionId={editTransactionId}
          editName={editName}
          editAmount={editAmount}
          editingCategoryId={editingCategoryId}
          editCategoryName={editCategoryName}
          editCategoryLimit={editCategoryLimit}
          handleAddTransaction={handleAddTransaction}
          handleSubmitTransaction={handleSubmitTransaction}
          handleEditClick={handleEditClick}
          handleUpdateTransaction={handleUpdateTransaction}
          handleDeleteTransaction={handleDeleteTransaction}
          startEditCategory={startEditCategory}
          handleUpdateCategory={handleUpdateCategory}
          handleDeleteCategory={handleDeleteCategory}
          setShowTransactionForm={setShowTransactionForm}
          setTransactionName={setTransactionName}
          setTransactionAmount={setTransactionAmount}
          setEditName={setEditName}
          setEditAmount={setEditAmount}
          setEditingCategoryId={setEditingCategoryId}
          setEditCategoryName={setEditCategoryName}
          setEditCategoryLimit={setEditCategoryLimit}
          setEditTransactionId={setEditTransactionId}
        />
      ) : (
        <CatHistorico categories={categories} selectedMonth={selectedMonth} />
      )}
      {/* Si estamos en el mes actual mostramos formularios edicción y añadir */}
      {selectedMonth === currentMonth && (
        <>
          {showCategoryForm ? (
            <form onSubmit={handleAddCategory} className="categoryAdd-form">
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
              className="general-AddButton"
              onClick={() => setShowCategoryForm(true)}
            >
              ➕ Añadir categoría
            </button>
          )}
        </>
      )}
    </div>
  );
}
