import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function CategoryBar({ total, limit }) {
  // Evitar división por cero
  const percentage = limit > 0 ? Math.min((total / limit) * 100, 100) : 0;

  // Datos para Recharts
  const data = [
    {
      name: "Gasto",
      total: total,
    },
  ];

  return (
    <div style={{ marginTop: "10px" }}>
      <ResponsiveContainer width="100%" height={30}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis type="number" hide domain={[0, limit]} />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip
            formatter={(value) => `${value} €`}
            cursor={{ fill: "rgba(0,0,0,0.1)" }}
          />
          <Bar
            dataKey="total"
            fill={total >= limit ? "rgba(109, 15, 73, 0.85)" : "rgba(9, 90, 86, 0.85)"}
            isAnimationActive={true}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Etiquetas debajo */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    marginTop: "5px",
    fontSize: "0.9em",
    backgroundColor: "#097f94ff", // fondo suave gris
    padding: "6px 8px",
    borderRadius: "6px",
    color: "#ffffffff", // texto oscuro
    fontWeight: "500",
  }}
>
  <span>Total: {total} €</span>
  <span>Límite: {limit} €</span>
  <span>%: {percentage.toFixed(1)}%</span>
</div>
    </div>
  );
}




