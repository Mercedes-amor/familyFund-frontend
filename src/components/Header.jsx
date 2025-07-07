import graficImg from "../assets/grafic.svg"

function Header() {
  return (
    <header id="title">
      <h1>Bienvenido a FamilyFund</h1>
      <p>Prueba desde React</p>
      <img src={graficImg} alt="20px" />
    </header>
  );
}

export default Header;
