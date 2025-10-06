import CategoryBar from "./CategoryBar";

export default function CatHistorico({ categories, selectedMonth }) {
  return (
    <div className="categories-div">
      {categories.map((category) => {
        const filteredTransactions = category.transactions.filter(
          (tx) => tx.date && tx.date.slice(0, 7) === selectedMonth
        );

        return (
          <div key={category.id} className="category-wrapper">
            <div
              className="category-card"
              style={{ backgroundColor: category.deleted ? "#ffcccc" : "#fff" }}
            >
              <h3>{category.name}</h3>
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
