//GRÁFICO CIRCULAR INGRESOS
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function IngresosBar({ gastos, ingresos, actualSave }) {

  // Restante = ingresos - gasto - ahorro
  const restante = Math.max(ingresos - gastos - actualSave, 0);

  const data = [
    { name: "Gastado", value: gastos },
    { name: "Ahorro", value: actualSave },
    { name: "Restante", value: restante },
  ];

  const COLORS = ["#610226", "#c7a719ff", "#0c7c1bff"]; // Gastado / Ahorro / Restante

  const porcentajeGastado = ingresos > 0 ? (gastos / ingresos) * 100 : 0;
  const porcentajeAhorro = ingresos > 0 ? (actualSave / ingresos) * 100 : 0;
  const porcentajeRestante = ingresos > 0 ? (restante / ingresos) * 100 : 0;

  return (
    <div style={{ marginTop: "10px", textAlign: "center" }}>
      <ResponsiveContainer width="100%" height={120}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={35} // donut
            outerRadius={50}
            paddingAngle={2}
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => `${value.toFixed(2)} €`}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Leyenda / información */}
      <div
        style={{
          marginTop: "5px",
          fontSize: "0.9em",
          backgroundColor: "#097f94ff",
          padding: "6px 8px",
          borderRadius: "6px",
          color: "#ffffff",
          fontWeight: "500",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Gasto: {gastos.toFixed(2)} €</span>
        <span>Ahorro: {actualSave.toFixed(2)} €</span>
        <span>Restante: {restante.toFixed(2)} €</span>
      </div>
    </div>
  );
}
