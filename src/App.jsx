import { useEffect, useState } from "react";
//Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
//Components
import Header from "./components/Header";
import ListaUsuarios from "./components/ListaUsuarios";
import Container from "./components/Container";




function App() {
  const [msg, setMsg] = useState("Cargando...");

  //Comprobar conexión con servidor
  useEffect(() => {
    fetch("http://localhost:8080/api/ping")
      .then((res) => res.text())
      .then((data) => setMsg(data))
      .catch((err) => {
        console.error("Error al conectar con backend:", err);
        setMsg("Error de conexión");
      });
  }, []);



  return (
    <>
      <Header />
      <Container>
        <h4>
          Conexión backend: <span>{msg}</span>
        </h4>
        <ListaUsuarios />
      </Container>
  
    </>
  );
}

export default App;
