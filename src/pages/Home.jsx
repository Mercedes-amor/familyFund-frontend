import { useNavigate } from "react-router-dom";



function Home() {

  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="left-panel">
        <h1>FamilyFund</h1>
        <p>EL AHORRO EMPIEZA CON EL CONTROL</p>
      </div>
      <div className="right-panel">
        <button onClick={() => navigate("/login")}>Iniciar Sesión</button>
        <button onClick={() => navigate("/signup")}>Registrarse</button>
      </div>

    </div>
  );
}

export default Home;
