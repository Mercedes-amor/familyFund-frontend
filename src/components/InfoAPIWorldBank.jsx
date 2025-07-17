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
          params: {
            format: "json",
            per_page: 60
          }
        });
        const datosInflacion = res1.data[1] //res1 es un array de 2 elementos, el 0 tiene metadatos, el 1 es el array de resultados por año
          .filter((item) => item.value !== null) //Quitamos los años sin valor numérico
          .map((item) => ({ //Nos quedamos solo con los datos de año y valor
            year: item.date,
            value: item.value
          }))
          .reverse();
        setInflacion(datosInflacion);

        const res2 = await axios.get("https://api.worldbank.org/v2/country/ES/indicator/NY.GNS.ICTR.ZS", {
          params: {
            format: "json",
            per_page: 60
          }
        });
        const datosAhorro = res2.data[1] 
          .filter((item) => item.value !== null) 
          .map((item) => ({
            year: item.date,
            value: item.value
          }))
          .reverse();
        setAhorro(datosAhorro);

      } catch (error) {
        console.error("Error al obtener datos del World Bank:", error);
      }
    };

    fetchData(); //Ejecutamos la función que acabamos de crear
  }, []);

  // Clausa de guardia para loading
  if (inflacion === null || ahorro===null){
    return <h3>loading</h3>
  }

  return (
    <div className="space-y-10 p-4">
      <div>
        <h2 className="text-xl font-bold mb-4">Inflación anual en España (%)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={inflacion}>
            <XAxis dataKey="year" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="value" stroke="#591263ff" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Tasa de ahorro (% del PIB)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ahorro}>
            <XAxis dataKey="year" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="value" stroke="#104741ff" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
