import { useEffect, useState } from "react";
import Container from "../components/Container";
import ListaUsuarios from "../components/ListaUsuarios";

function About() {
  const [msg, setMsg] = useState("Cargando...");
  const [isTimerShowing, setIsTimerShowing] = useState(false);
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
      <Container>
        <h4>
          Conexión backend: <span>{msg}</span>
        </h4>
        <ListaUsuarios />
      </Container>
    </>
  );
}

export default About;
