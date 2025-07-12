import graficImg from "../assets/grafic.svg";

function Header() {
  return (
    <header id="title">
      <img src={graficImg} height="100px" />
      <h1>Bienvenido a FamilyFund</h1>
    </header>
  );
}

export default Header;
