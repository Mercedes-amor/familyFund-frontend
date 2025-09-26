import { useEffect, useState, useContext } from "react";
import Container from "../components/Container";
import ListaUsuarios from "../components/ListaUsuarios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/theme.context";
import axios from "axios";
import InfoAPIWorldBank from "../components/InfoAPIWorldBank";

//Estilos
import { ClipLoader, SyncLoader } from "react-spinners";

function About() {
  const [msg, setMsg] = useState("...cargando");
  const [isFetching, setIsFetching] = useState(true);
  const {isThemeDark, btnThemeClassName} = useContext(ThemeContext);


  const navigate = useNavigate();

  //Comprobar conexión con servidor

  const testBackConexion = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/ping");
      setMsg(response.data);
      setIsFetching(false); //Comentar para ver el spinner
    } catch (error) {
      console.error("Error al conectar con backend:", error);
      setMsg("Error de conexión");
      navigate("/error");
    }
  };

  useEffect(() => {
    testBackConexion();
  }, []);

  const handleRefresh = () => {
    setIsFetching(true);
    testBackConexion();
  };

  if (isFetching === true) {
    return (
      <div>
        <SyncLoader color="#24867d" size={15} />
      </div>
    )
  }

  <SyncLoader color="#24867d" size={15} />;
  return (
    <>
      <Container>
        <button className={btnThemeClassName} onClick={handleRefresh}>Refrescar</button>
        <h4>
          Conexión backend: <span>{msg}</span>
        </h4>
         <InfoAPIWorldBank />
      </Container>
    </>
  );
}

export default About;
