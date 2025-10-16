import { useEffect, useState } from "react";
import axios from "axios";

//Estilos
import "../Dashboard.css";
import { ClipLoader, SyncLoader } from "react-spinners";


export default function DayQuote() {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/quotes/random", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setQuote(res.data[0]); // ZenQuotes devuelve un array con un objeto
      } catch (err) {
        console.error("Error obteniendo cita:", err);
      }
    };

    fetchQuote();
  }, []);

  if (!quote)  {
    return (
     <div className="spinner-div">
        <SyncLoader color="#d4e2e1ff" size={15} />
      </div>
    )
  }
return (
  <div className="dayQuote-div">
    <h3 className="dayQuote-title">✨ Frase del día 🌺</h3>
    <blockquote className="dayQuote-text">“{quote.q}”</blockquote>
    <p className="dayQuote-author">{quote.a}</p>
  </div>
);

}
