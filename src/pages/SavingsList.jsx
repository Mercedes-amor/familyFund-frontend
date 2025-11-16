import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClipLoader, SyncLoader } from "react-spinners";


import "../SavingsList.css";

export default function SavingsList() {
  const { familyId } = useParams();

  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchSavings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8080/api/families/${familyId}/savings`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      if (!res.ok) throw new Error("Error al cargar los ahorros");

      const data = await res.json();

      setSavings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavings();
  }, [familyId]);

  if (loading) {
    return (
      <div className="spinner-div">
        <SyncLoader color="#d4e2e1ff" size={15} />
      </div>
    );
  }
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="SavingsList-container">
      <div className="Title-Volver-wrapper">
        <h2 className="h2-savings">Historial de Savings</h2>
        <button onClick={() => navigate(-1)} className="btn-volver">
          Volver
        </button>
      </div>

      {savings.length === 0 ? (
        <p>No hay ahorros todavía.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cantidad</th>
                <th>Usuario</th>
              </tr>
            </thead>
            <tbody>
              {savings.map((s) => (
                <tr key={s.id} className="saving-item">
                  <td>{new Date(s.createAt).toLocaleDateString("es-ES")}</td>

                  <td>
                    <strong>{s.amount.toFixed(2)} €</strong>
                  </td>

                  {/* Usuario o sistema */}
                  <td>
                    {s.system ? (
                      <span className="imgSistema">Sistema</span>
                    ) : (
                      <div>
                        <img className="imgUsuario" src={s.photoUrl} alt="" />
                        <span>{s.usuarioNombre}</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
