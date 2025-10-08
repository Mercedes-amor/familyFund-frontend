import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Función para formatear "YYYY-MM" → "Septiembre 2025"
function formatMonth(monthString) {
  if (!monthString) return "";
  const [year, month] = monthString.split("-");
  const date = new Date(year, month - 1);
  const monthName = date.toLocaleString("es-ES", { month: "long" });
  return `${monthName} ${year}`;
}

export default function CategoryChart({ groupedByMonth }) {
  if (!groupedByMonth || Object.keys(groupedByMonth).length === 0) return null;

  const chartData = Object.entries(groupedByMonth).map(([month, txs]) => ({
    month: formatMonth(month),
    total: txs.reduce((sum, t) => sum + t.amount, 0),
  }));

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
        margin: "20px auto",
        textAlign: "center",
        background: "#ffffffea",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "20px",
      }}
    >
      <h3 style={{ color: "#041047", marginBottom: "10px" }}>Gastos por mes</h3>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid stroke="#0000005e" strokeDasharray="5 5" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#041047", fontSize: 14, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
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
            <defs>
              <linearGradient id="GastosGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#610226" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#610226" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <Bar dataKey="total" radius={[8, 8, 0, 0]} fill="url(#GastosGradient)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
