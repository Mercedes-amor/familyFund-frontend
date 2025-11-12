import CategoryBar from "./CategoryBar";
import IngresosBar from "./IngresosBar";
import { useNavigate } from "react-router-dom";

export default function IngresosCard({
  categories,
  selectedMonth,
  showTransactionForm,
  selectedCategoryId,
  transactionName,
  transactionAmount,
  editTransactionId,
  editName,
  editAmount,
  editingCategoryId,
  handleAddTransaction,
  handleSubmitTransaction,
  handleEditClick,
  handleUpdateTransaction,
  handleDeleteTransaction,
  handleUpdateCategory,
  setShowTransactionForm,
  setTransactionName,
  setTransactionAmount,
  setEditName,
  setEditAmount,
  setEditingCategoryId,
  setEditTransactionId,
  totalGastosMes,
  totalIngresosMes,
  maxiGoal,
  currentMonth,
}) {
  const navigate = useNavigate();

  // Buscamos categoría INGRESOS
  const ingresosCategory = categories?.find(
    (cat) => cat.name?.toUpperCase() === "INGRESOS"
  );
  if (!ingresosCategory) return null; //Clausula seguridad

  // Filtrar transacciones del mes
  const filteredTransactions =
    ingresosCategory.transactions?.filter(
      (tx) => tx.date && tx.date.slice(0, 7) === selectedMonth
    ) ?? [];


  //Calcular el total de ahorros del mes
  const ahorroMes = maxiGoal?.savings?.filter(
    (s) => s.createAt && s.createAt.slice(0,7) === selectedMonth //comparar YYYY-MM
  ).reduce((sum, s)=> sum + s.amount,0)|| 0;

  return (
    <div className="category-wrapper">
      <div
        className={`category-card ${
          ingresosCategory.deleted ? "category-card-deleted" : ""
        }`}
      >
        <div className="category-header">
          {editingCategoryId === ingresosCategory.id &&
          selectedMonth === currentMonth ? (
            <div className="categoryForm-wrapper">
              <div className="general-form">
                <input
                  type="text"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  required
                />
                <div className="category-divEdit-buttons">
                  <button
                    id="guardarButton"
                    onClick={() => handleUpdateCategory(ingresosCategory.id)}
                  >
                    Guardar
                  </button>
                  <button
                    id="cancelButton"
                    onClick={() => setEditingCategoryId(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h3
                onClick={() =>
                  navigate(`/category-compare/${ingresosCategory.id}`)
                }
                style={{ cursor: "pointer" }}
              >
                {ingresosCategory.name}
              </h3>
            </>
          )}
        </div>

        <ul className="transactions-list">
          {filteredTransactions.length === 0 ? (
            <li>No hay transacciones este mes</li>
          ) : (
            filteredTransactions.map((tx) => (
              <li key={tx.id}>
                <img
                  src={
                    tx.user?.photoUrl ||
                    "https://res.cloudinary.com/dz2owkkwa/image/upload/v1760687036/Familyfund/Dise%C3%B1o_sin_t%C3%ADtulo-removebg-preview_vqqzhb.png"
                  }
                  alt={tx.nombre}
                  className="member-photo"
                />

                {editTransactionId === tx.id &&
                selectedMonth === currentMonth ? (
                  <form
                    onSubmit={(e) =>
                      handleUpdateTransaction(ingresosCategory.id, tx.id, e)
                    }
                    className="new-transaction-form"
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
                    <div className="category-divEdit-buttons">
                      <button type="submit" id="guardarButton">
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditTransactionId(null)}
                        id="cancelButton"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="transaction-item">
                    {tx.name} - {tx.amount} €
                    {selectedMonth === currentMonth && (
                      <span className="spanEdit-buttons">
                        <button onClick={() => handleEditClick(tx)}>✏️</button>
                        <button
                          onClick={() =>
                            handleDeleteTransaction(ingresosCategory.id, tx.id)
                          }
                        >
                          🗑️
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </li>
            ))
          )}
        </ul>

        {selectedMonth === currentMonth && (
          <>
            <button
              className="add-transaction-btn"
              onClick={() => handleAddTransaction(ingresosCategory.id)}
            >
              ➕ Añadir
            </button>

            {showTransactionForm &&
              selectedCategoryId === ingresosCategory.id && (
                <form
                  onSubmit={handleSubmitTransaction}
                  className="new-transaction-form"
                >
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
                  <div className="category-divEdit-buttons">
                    <button type="submit" id="guardarButton">
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTransactionForm(false)}
                      id="cancelButton"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
          </>
        )}

        {/* Gráfico circular de ingresos */}
        <IngresosBar
          gastos={totalGastosMes}
          ingresos={totalIngresosMes}
          actualSave={ahorroMes}
        />
      </div>
    </div>
  );
}
