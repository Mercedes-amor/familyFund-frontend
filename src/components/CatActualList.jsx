// CatActualList.jsx
import CategoryBar from "./CategoryBar";
import { useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import IngresosBar from "./IngresosBar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faEdit,
  faTrashArrowUp,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

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
  currentUserId,
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

      const showIngresosBar = category.name === "INGRESOS";

      let totalGastosMes = 0;
      let limiteMes = 0;

      if (showIngresosBar) {
        limiteMes = filteredTransactions
          .filter((tx) => tx.type === "INCOME")
          .reduce((sum, tx) => sum + tx.amount, 0);

        totalGastosMes = categories
          .flatMap((cat) => cat.transactions)
          .filter(
            (tx) =>
              tx.date &&
              tx.date.slice(0, 7) === selectedMonth &&
              tx.type === "EXPENSE"
          )
          .reduce((sum, tx) => sum + tx.amount, 0);

        limiteMes = parseFloat(limiteMes.toFixed(2));
        totalGastosMes = parseFloat(totalGastosMes.toFixed(2));
      }

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
                    {editTransactionId === tx.id ? (
                      <form
                        onSubmit={(e) =>
                          handleUpdateTransaction(
                            category.id,
                            tx.id,
                            e,
                            tx.amount
                          )
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
                        <span className="tx-name">{tx.name}</span>

                        <span className="tx-amount">{tx.amount} €</span>

                        {/* Usuario o sistema */}
                        {tx.user == null ? (
                          <span className="imgSistema">Sistema</span>
                        ) : (
                          <div className="tx-user-data">
                            <img
                              className="imgUsuario"
                              src={
                                tx.user.photoUrl ||
                                "https://res.cloudinary.com/dz2owkkwa/image/upload/v1760687036/Familyfund/Dise%C3%B1o_sin_t%C3%ADtulo-removebg-preview_vqqzhb.png"
                              }
                              alt={tx.user.name}
                            />
                            <span>{tx.user.name}</span>
                          </div>
                        )}

                        {/* Solo editar/borrar si pertenece al user actual */}
                        {tx.user && tx.user.id === currentUserId ? (
                          <span className="spanEdit-buttons">
                            <FontAwesomeIcon
                              icon={faEdit}
                              style={{ cursor: "pointer", color: "#105c53" }}
                              onClick={() => handleEditClick(tx)}
                            />
                            <FontAwesomeIcon
                              icon={faTrashArrowUp}
                              style={{ cursor: "pointer", color: "#521005" }}
                              onClick={() =>
                                handleDeleteTransaction(category.id, tx.id)
                              }
                            />
                          </span>
                        ) : (
                          <span className="spanEdit-buttons empty"></span>
                        )}
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>

            <div className="div-char-container">
              {!(
                showTransactionForm && selectedCategoryId === category.id
              ) && (
                <button
                  className="add-transaction-btn"
                  onClick={() => handleAddTransaction(category.id)}
                >
                  ➕ Añadir gasto
                </button>
              )}

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

              {showIngresosBar && (
                <IngresosBar gastos={totalGastosMes} limite={limiteMes} />
              )}

              {category.name !== "INGRESOS" && (
                <CategoryBar
                  total={filteredTransactions.reduce(
                    (sum, t) => sum + t.amount,
                    0
                  )}
                  limit={category.limit}
                />
              )}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

}
