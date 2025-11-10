import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function IngresosPie({ gastos, limite }) {
  const restante = Math.max(limite - gastos, 0);

  const data = [
    { name: "Gastado", value: gastos },
    { name: "Restante", value: restante },
  ];

  const COLORS = ["#610226", "#041047"]; // Gastado / Restante

  const porcentaje = limite > 0 ? Math.min((gastos / limite) * 100, 100) : 0;

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
          <Tooltip formatter={(value, name) => `${value.toFixed(2)} €`} />
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
        <span>Gastos: {gastos.toFixed(2)} €</span>
        <span>Ingresos: {limite.toFixed(2)} €</span>
        <span>%: {porcentaje.toFixed(1)}%</span>
      </div>
    </div>
  );
}
