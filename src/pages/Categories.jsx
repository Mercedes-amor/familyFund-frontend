import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import CatActualList from "../components/CatActualList";
import CatHistorico from "../components/CatHistorico";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

//Estilos
import { ClipLoader, SyncLoader } from "react-spinners";
import "../CategoriesPage.css";
import MaxiGoal from "../components/MaxiGoal";


export default function CategoriasPage() {
  const { user, userLoading } = useContext(UserContext);
  const [family, setFamily] = useState([]);
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
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      // 1. Obtenemos la familia (incluye maxiGoal)
      const familyRes = await fetchWithAuth(
        `http://localhost:8080/api/families/${familyId}`,
        { headers: { Authorization: "Bearer " + token } }
      );

      if (!familyRes.ok) throw new Error("Error al cargar familia");

      const familyData = await familyRes.json();
      setFamily(familyData); // <-- AQUÍ guardamos el maxiGoal también

      // 2. Obtenemos categorías según mes
      const endpoint =
        selectedMonth === currentMonth
          ? `http://localhost:8080/api/families/${familyId}/categories`
          : `http://localhost:8080/api/families/${familyId}/categories/history`;

      const categoriesRes = await fetchWithAuth(endpoint, {
        headers: { Authorization: "Bearer " + token },
      });

      if (!categoriesRes.ok) throw new Error("Error al cargar categorías");

      const categoriesData = await categoriesRes.json();

      // 3. Obtenemos transacciones por categoría
      const categoriesWithTx = await Promise.all(
        categoriesData.map(async (cat) => {
          const txRes = await fetchWithAuth(
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
  //------ Fin fechData() -----

  // ------ UseEffect -----
  useEffect(() => {
    if (!familyId || userLoading) return;
    fetchData();
  }, [userLoading, familyId, selectedMonth]);

  // ----- MÉTODOS -----
  // ----- TRANSACCIONES -----
  const handleAddTransaction = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setShowTransactionForm(true);
    setTransactionName("");
    setTransactionAmount("");
  };

  //POST: Crear transacción (Ingreso o gasto)
  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      //Parseamos el valor importe
      let amount = parseFloat(transactionAmount);

      //Validación importe amount
      if (isNaN(amount) || amount < 0) {
        toast.error("El importe debe introducirse en positivo");
        return;
      }

      //Redondeo a 2 decimales
      amount = parseFloat(amount.toFixed(2));

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
            amount,
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
      // alert(err.message);
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

      //Parseamos el valor importe
      let amount = parseFloat(editAmount);

      // Validación del límite
      if (isNaN(amount) || amount < 0) {
        toast.error("El importe debe introducirse en positivo.");
        return;
      }

      //Redondeo a 2 decimales
      amount = parseFloat(amount.toFixed(2));

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
            amount,
            type: "EXPENSE",
            date: new Date().toISOString().split("T")[0],
          }),
        }
      );

      //Mostrar mensaje de error
      let errorMessage = "Error desconocido";

      if (!response.ok) {
        // Intentar leer el cuerpo
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          // Si el backend envía { error: "mensaje" } o { message: "mensaje" }
          errorMessage = data.error || data.message || errorMessage;
        } catch {
          // Si no es JSON, usamos el texto directamente
          errorMessage = text;
        }
        throw new Error(errorMessage);
      }

      // const result = await response.json();

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
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/transactions/${txId}`,
        { method: "DELETE", headers: { Authorization: "Bearer " + token } }
      );

      //Mostrar mensaje de error
      let errorMessage = "Error desconocido";

      if (!response.ok) {
        // Intentar leer el cuerpo
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          // Si el backend envía { error: "mensaje" } o { message: "mensaje" }
          errorMessage = data.error || data.message || errorMessage;
        } catch {
          // Si no es JSON, usamos el texto directamente
          errorMessage = text;
        }
        throw new Error(errorMessage);
      }

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

    //Parseamos el valor del límite
    let limit = parseFloat(formData.get("limit"));

    //Validación límite
    if (isNaN(limit) || limit < 0) {
      toast.error("El límite debe ser positivo");
      return;
    }

    //Redondeo a 2 decimales
    limit = parseFloat(limit.toFixed(2));

    const newCategory = {
      name: formData.get("name"),
      limit,
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

      let limit = parseFloat(editCategoryLimit);

      // Validación del límite
      if (isNaN(limit) || limit < 0) {
        toast.error("El límite debe ser un número positivo.");
        return;
      }

      // Redondeo a 2 decimales
      limit = parseFloat(limit.toFixed(2));

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
            limit,
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
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Borrarás la categoría y todos los gastos de este mes",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

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
      <div className="hucha-wrapper">
        <h2 className="h2-title">Categorías</h2>
        <MaxiGoal maxigoal={family?.maxiGoal} refreshData={fetchData} />
      </div>

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
        <>
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
        </>
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
