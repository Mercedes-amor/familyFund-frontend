// DashboardChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DashboardChart({ ingresos, gastos }) {
  // Datos para la gráfica
  const data = [
    {
      name: "Resumen",
      Ingresos: ingresos,
      Gastos: gastos,
    },
  ];

  return (
    <div style={{ width: "100%", height: 300, marginTop: "20px" }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `${value} €`} />
          <Legend />
          <Bar dataKey="Ingresos" fill="rgba(7, 107, 40, 1)" />
          <Bar dataKey="Gastos" fill="rgba(109, 15, 73, 1)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
