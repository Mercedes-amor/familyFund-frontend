import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function InfoAPIWorldBank() {
  const [inflacion, setInflacion] = useState(null);
  const [ahorro, setAhorro] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await axios.get("https://api.worldbank.org/v2/country/ES/indicator/FP.CPI.TOTL.ZG", {
          params: { format: "json", per_page: 60 }
        });
        const datosInflacion = res1.data[1]
          .filter((item) => item.value !== null)
          .map((item) => ({ year: item.date, value: item.value }))
          .reverse();
        setInflacion(datosInflacion);

        const res2 = await axios.get("https://api.worldbank.org/v2/country/ES/indicator/NY.GNS.ICTR.ZS", {
          params: { format: "json", per_page: 60 }
        });
        const datosAhorro = res2.data[1]
          .filter((item) => item.value !== null)
          .map((item) => ({ year: item.date, value: item.value }))
          .reverse();
        setAhorro(datosAhorro);

      } catch (error) {
        console.error("Error al obtener datos del World Bank:", error);
      }
    };

    fetchData();
  }, []);

  if (!inflacion || !ahorro) {
    return <h3 className="text-center mt-10">Cargando datos...</h3>;
  }

  const tooltipFormatter = (value) => `${value.toFixed(2)}%`;

  const chartStyle = {
    backgroundColor: "rgba(245, 249, 251, 0.9)",
    borderRadius: "8px",
    padding: "0",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    margin: "20px 0px",
    width:"100%"
  };

  return (
    <div className="flex flex-col p-3">
  <div style={chartStyle}>

    <h5 className="text-xl font-bold mb-4 text-center" style={{ color: "#1a0b42b9", paddingTop:"10px"}}>Inflación anual en España (%)</h5>
    <ResponsiveContainer width="100%" height={150}>
      <LineChart data={inflacion}>
        <XAxis dataKey="year" tick={{ fontSize: 12 }} />
        <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
        <Tooltip formatter={tooltipFormatter} />
        <CartesianGrid strokeDasharray="3 3" stroke="#1a0b42b9" />
        <Line type="monotone" dataKey="value" stroke="#FF5733" strokeWidth={2} dot={{ r: 3 }} animationDuration={1500} />
      </LineChart>
    </ResponsiveContainer>
  </div>


<div style={chartStyle}>
      <h5 className="text-xl font-bold mb-4 text-center " style={{ color: "#1a0b42b9", paddingTop:"10px" }}>Tasa de ahorro (% del PIB)</h5>
    <ResponsiveContainer width="100%" height={150} padding={20}>
      <LineChart data={ahorro}>
        <XAxis dataKey="year" tick={{ fontSize: 12 }} />
        <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
        <Tooltip formatter={tooltipFormatter} />
        <CartesianGrid strokeDasharray="3 3" stroke="#1a0b42b9" />
        <Line type="monotone" dataKey="value" stroke="#1F77B4" strokeWidth={2} dot={{ r: 3 }} animationDuration={1500} />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
  );
}
