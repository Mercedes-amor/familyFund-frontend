import Header from "./components/Header";
import { useEffect, useState } from 'react';

import "./App.css";
function App() {
  const [msg, setMsg] = useState('Cargando...');

  useEffect(() => {
    fetch('http://localhost:8080/api/ping')
      .then(res => res.text())
      .then(data => setMsg(data))
      .catch(err => {
        console.error('Error al conectar con backend:', err);
        setMsg('Error de conexión');
      });
  }, []);

  return (
    <div>
      <h1>Conexión backend</h1>
      <p>{msg}</p>
      <Header/>
    </div>
  );
}

export default App;
