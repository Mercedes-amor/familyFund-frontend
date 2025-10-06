import { useState } from "react";
import CategoryBar from "./CategoryBar";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export default function CatListadoActual({ categories, setCategories, familyId }) {
  

  // Render
  return (
      <div className="categories-wrapper">
        <h2 className="pageH2">Categorías</h2>
  
        {/* Select del mes */}
        <div style={{ marginBottom: "20px" }}>
          <label>Mes: </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
  
        {/* Categories Card */}
        <div className="categories-div">
          {categories.map((category) => {
            const filteredTransactions = category.transactions.filter(
              (tx) => tx.date && tx.date.slice(0, 7) === selectedMonth
            );
  
            return (
              <div key={category.id} className="category-wrapper">
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
                          <button onClick={() => startEditCategory(category)}>
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </>
                    )}
                  </div>
  
                  {/* Lista de transacciones filtradas por mes */}
                  <ul className="transactions-list">
                    {filteredTransactions.length === 0 ? (
                      <li>No hay transacciones este mes</li>
                    ) : (
                      filteredTransactions.map((tx) => (
                        <li key={tx.id}>
                          {editTransactionId === tx.id ? (
                            <form
                              onSubmit={(e) =>
                                handleUpdateTransaction(category.id, tx.id, e)
                              }
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
                            </div>
                          )}
                        </li>
                      ))
                    )}
                  </ul>
  
                  {/* Botón ➕ Añadir y formulario dentro de la tarjeta */}
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
                      <button type="submit">Guardar</button>
                      <button
                        type="button"
                        onClick={() => setShowTransactionForm(false)}
                      >
                        Cancelar
                      </button>
                    </form>
                  )}
  
                  {/* Barra de progreso de gastos usando CategoryBar */}
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
      </div>
    );
  }
  


