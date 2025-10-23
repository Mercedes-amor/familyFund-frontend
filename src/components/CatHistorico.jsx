import { useNavigate } from "react-router-dom";
import CategoryBar from "./CategoryBar";

export default function CatHistorico({ categories, selectedMonth }) {
  const navigate = useNavigate(); // Tuvimos que sacarlo del map

  return (
    <div className="categories-div">
      {categories.map((category) => {
        const filteredTransactions = category.transactions.filter(
          (tx) => tx.date && tx.date.slice(0, 7) === selectedMonth
        );

        const handleCardClick = () => {
          navigate(`/category-compare/${category.id}`); //Lo invocamos dentro del map
        };

        if (filteredTransactions.length === 0) return null;

        return (
          <div key={category.id} className="category-wrapper">
            <div className={`category-card ${category.deleted ? "category-card-deleted" : ""}`}>
              <div className="category-header">
                <h3 onClick={handleCardClick} style={{ cursor: "pointer" }}>
                  {category.name}
                </h3>
              </div>

              <ul className="transactions-list">
                {filteredTransactions.map((tx) => (
                  <li key={tx.id}>
                    {tx.name} - {tx.amount} €
                  </li>
                ))}
              </ul>

              <CategoryBar
                total={filteredTransactions.reduce((sum, t) => sum + t.amount, 0)}
                limit={category.limit}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
