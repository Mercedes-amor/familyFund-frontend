import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function IngresosBar({ gastos, limite }) {
  // Evitar valores negativos
  const restante = Math.max(limite - gastos, 0);

  // Datos para barras apiladas
  const data = [
    {
      name: "Ingresos",
      Gastado: gastos,
      Restante: restante,
    },
  ];

  // Porcentaje de gasto sobre el límite
  const porcentaje = limite > 0 ? Math.min((gastos / limite) * 100, 100) : 0;

  return (
    <div style={{ marginTop: "10px" }}>
      <ResponsiveContainer width="100%" height={40}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis type="number" hide domain={[0, limite]} />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip
            formatter={(value, name) => `${value} €`}
            cursor={{ fill: "rgba(65, 4, 37, 0.76)" }}
          />
          {/* Parte restante */}
          <Bar
            dataKey="Restante"
            stackId="a"
            fill="rgba(23, 90, 9, 0.85)"
            isAnimationActive={true}
          />
          {/* Parte gastada */}
          <Bar
            dataKey="Gastado"
            stackId="a"
            fill="rgba(126, 11, 30, 0.85)"
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
          backgroundColor: "#097f94ff",
          padding: "6px 8px",
          borderRadius: "6px",
          color: "#ffffff",
          fontWeight: "500",
        }}
      >
        <span>Gasto: {gastos.toFixed(2)} €</span>
        <span>Límite: {limite.toFixed(2)} €</span>
        {/* <span>Límite: {limite} €</span> */}
        <span>%: {porcentaje.toFixed(1)}%</span>
      </div>
    </div>
  );
}
