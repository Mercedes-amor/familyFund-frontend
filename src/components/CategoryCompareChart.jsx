import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

// Función para formatear "YYYY-MM" → "Septiembre 2025"
function formatMonth(monthString) {
  if (!monthString) return "";
  const [year, month] = monthString.split("-");
  const date = new Date(year, month - 1);
  const monthName = date.toLocaleString("es-ES", { month: "long" });
  return `${monthName} ${year}`;
}

// Paleta de colores
const colors = ["#610226", "#097f94", "#d47d1d", "#6a1b9a", "#0288d1", "#388e3c"];

export default function CategoryCompareChart({ groupedByMonth }) {
  if (!groupedByMonth || Object.keys(groupedByMonth).length === 0) return null;

  const chartData = Object.entries(groupedByMonth).map(([month, txs]) => ({
    month: formatMonth(month),
    total: txs.reduce((sum, t) => sum + t.amount, 0),
  }));

    return (
    <div
      style={{
        width: "80%",
        maxWidth: "900px",
        maxHeight:"600px",
        margin: "20px auto",
        textAlign: "center",
        background: "#ffffffea",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "20px",
      }}
    >
      <h3 style={{ color: "#041047", marginBottom: "10px" }}>Gastos por mes</h3>

      <div className="chart-responsive"  style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 30 }}>
            <CartesianGrid stroke="#0000005e" strokeDasharray="5 5" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#041047", fontSize: 14, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis
              tick={{ fill: "#041047", fontSize: 14 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: 8,
                boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                border: "none",
              }}
              itemStyle={{ color: "#041047", fontWeight: 500 }}
              formatter={(value) => `${value} €`}
            />
            <Bar dataKey="total" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}