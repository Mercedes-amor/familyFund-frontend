// CatActualList.jsx
import CategoryBar from "./CategoryBar";
import { useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

export default function CatActualList({
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
  editCategoryName,
  editCategoryLimit,
  handleAddTransaction,
  handleSubmitTransaction,
  handleEditClick,
  handleUpdateTransaction,
  handleDeleteTransaction,
  startEditCategory,
  handleUpdateCategory,
  handleDeleteCategory,
  setShowTransactionForm,
  setTransactionName,
  setTransactionAmount,
  setEditName,
  setEditAmount,
  setEditingCategoryId,
  setEditCategoryName,
  setEditCategoryLimit,
  setEditTransactionId,
}) {
  //Enlace de redirección a category-compare
  const navigate = useNavigate();
  const handleCardClick = (e, categoryId) => {
    navigate(`/category-compare/${categoryId}`);
  };

  //RENDERIZACIÓN
  return (
    <div className="categories-div">
      {categories.map((category) => {
        const filteredTransactions = category.transactions.filter(
          (tx) => tx.date && tx.date.slice(0, 7) === selectedMonth
        );
        console.log("filteredTransactions: ", filteredTransactions);
        return (
          <div key={category.id} className="category-wrapper">
            <div
              className={`category-card ${
                category.deleted ? "category-card-deleted" : ""
              }`}
            >
              <div className="category-header">
                {editingCategoryId === category.id ? (
                  <div className="categoryForm-wrapper">
                    <div className="general-form">
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
                      <div className="category-divEdit-buttons">
                        <button
                          id="guardarButton"
                          onClick={() => handleUpdateCategory(category.id)}
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
                      onClick={() => handleCardClick(null, category.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {category.name}
                    </h3>
                    <span className="category-actions">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => startEditCategory(category)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Borrar
                      </button>
                    </span>
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
                          tx.user.photoUrl ||
                          "https://res.cloudinary.com/dz2owkkwa/image/upload/v1760687036/Familyfund/Dise%C3%B1o_sin_t%C3%ADtulo-removebg-preview_vqqzhb.png"
                        }
                        alt={tx.nombre}
                        className="member-photo"
                      />
                      {editTransactionId === tx.id ? (
                        <form
                          onSubmit={(e) =>
                            handleUpdateTransaction(category.id, tx.id, e)
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
                          <span className="spanEdit-buttons">
                            <button onClick={() => handleEditClick(tx)}>
                              ✏️
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteTransaction(category.id, tx.id)
                              }
                            >
                              🗑️
                            </button>
                          </span>
                        </div>
                      )}
                    </li>
                  ))
                )}
              </ul>

              <button
                className="add-transaction-btn"
                onClick={() => handleAddTransaction(category.id)}
              >
                ➕ Añadir
              </button>

              {showTransactionForm && selectedCategoryId === category.id && (
                <form
                  onSubmit={handleSubmitTransaction}
                  className="new-transaction-form"
                  style={{ marginTop: "10px" }}
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

              <CategoryBar
                total={filteredTransactions.reduce(
                  (sum, t) => sum + t.amount,
                  0
                )}
                limit={category.limit}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
