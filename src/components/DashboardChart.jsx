// DashboardChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardChart({ ingresos, gastos, ahorro }) {
  const data = [
    {
      name: "Resumen",
      Ingresos: ingresos,
      Gastos: gastos,
      Ahorro: ahorro,
    },
  ];

  //Obtener el nombre del mes actual
  const currentMonth = new Date().toISOString().slice(0, 7);
  // Convertir a nombre del mes
  const monthName = new Date(currentMonth + "-01").toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  //RENDERIZACIÓN
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
      {/* Título */}
      <h3 style={{ color: "#041047", marginBottom: "10px" }}>{monthName}</h3>

      {/* Gráfica */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke="#0000005e" strokeDasharray="5 5" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#ffffff05", fontSize: 1, fontWeight: 0 }}
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
              <linearGradient id="IngresosGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#041047" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#041047" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="GastosGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#610226" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#610226" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="AhorroGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ad7610ff" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#c2bf0cff" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <Bar
              dataKey="Ingresos"
              radius={[8, 8, 0, 0]}
              fill="url(#IngresosGradient)"
            />
            <Bar
              dataKey="Gastos"
              radius={[8, 8, 0, 0]}
              fill="url(#GastosGradient)"
            />
            <Bar
              dataKey="Ahorro"
              radius={[8, 8, 0, 0]}
              fill="url(#AhorroGradient)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda personalizada debajo */}
      <div
        style={{
          marginTop: "15px",
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          fontSize: "15px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "12px",
              height: "12px",
              background: "#041047",
              borderRadius: "50%",
            }}
          ></span>
          <strong>Ingresos:</strong> {ingresos.toLocaleString()} €
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "12px",
              height: "12px",
              background: "#610226",
              borderRadius: "50%",
            }}
          ></span>
          <strong>Gastos:</strong> {gastos.toLocaleString()} €
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "12px",
              height: "12px",
              background: "#967d0dff",
              borderRadius: "50%",
            }}
          ></span>
          <strong>Ahorro:</strong> {ahorro.toLocaleString()} €
        </div>
      </div>
    </div>
  );
}
