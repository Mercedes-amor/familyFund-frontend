//GRÁFICO CIRCULAR
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function IngresosBar({ gastos, ingresos, actualSave }) {
  const restante = ingresos - gastos - actualSave;

  const data = [
    { name: "Gastos", value: gastos },
    { name: "Ahorro", value: actualSave },
    { name: "Fondos disponibles", value: restante },
  ];

  const COLORS = ["#610226", "#c7a719ff", "#0c7c1bff"];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "2px",
        marginTop: "15px",
      }}
    >
      {/* Leyenda vertical a la izquierda */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          minWidth: "120px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "14px",
              height: "14px",
              background: "#114a64ff",
              borderRadius: "4px",
            }}
          ></span>
          <span>Ingresos: {ingresos.toFixed(2)} €</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "14px",
              height: "14px",
              background: COLORS[0],
              borderRadius: "4px",
            }}
          ></span>
          <span>Gastado: {gastos.toFixed(2)} €</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "14px",
              height: "14px",
              background: COLORS[1],
              borderRadius: "4px",
            }}
          ></span>
          <span>Ahorro: {actualSave.toFixed(2)} €</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "14px",
              height: "14px",
              background: COLORS[2],
              borderRadius: "4px",
            }}
          ></span>
          <span>Restante: {restante.toFixed(2)} €</span>
        </div>
      </div>

      {/* Gráfico circular*/}
      <div style={{ width: "100%", height: "220px", minWidth: "200px", marginRight:"20px" }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60} // aumentado
              outerRadius={90} // aumentado
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
      </div>
    </div>
  );
}
