import { useNavigate } from "react-router-dom";
import CategoryBar from "./CategoryBar";

export default function CatHistorico({ categories, selectedMonth }) {
  return (
    <div className="categories-div">
      {categories.map((category) => {
        const filteredTransactions = category.transactions.filter(
          (tx) => tx.date && tx.date.slice(0, 7) === selectedMonth
        );
        //Enlace de redirección a category-compare
        const navigate = useNavigate();
        const handleCardClick = (e, categoryId) => {
          navigate(`/category-compare/${categoryId}`);
        };

        return (
          <>
            {filteredTransactions.length === 0 ? (
              ""
            ) : (
              <div key={category.id} className="category-wrapper">
                <div
                  className={`category-card ${
                    category.deleted ? "category-card-deleted" : ""
                  }`}
                >
                  <div className="category-header">
                    <h3
                      onClick={() => handleCardClick(null, category.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {category.name}
                    </h3>
                  </div>

                  <ul className="transactions-list">
                    {filteredTransactions.length === 0 ? (
                      <li>No hay transacciones este mes</li>
                    ) : (
                      filteredTransactions.map((tx) => (
                        <li key={tx.id}>
                          {tx.name} - {tx.amount} €
                        </li>
                      ))
                    )}
                  </ul>

                  <CategoryBar
                    total={filteredTransactions.reduce(
                      (sum, t) => sum + t.amount,
                      0
                    )}
                    limit={category.limit}
                  />
                </div>
              </div>
            )}
          </>
        );
      })}
    </div>
  );
}
