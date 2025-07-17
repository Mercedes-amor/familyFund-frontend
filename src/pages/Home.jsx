import graficImg from "../assets/grafic.svg";
import InfoAPIWorldBank from "../components/InfoAPIWorldBank";

function Home() {
  return (
    <header id="title">
      <img src={graficImg} height="100px" />
      <h1>Bienvenido a FamilyFund</h1>
      <InfoAPIWorldBank/>
    </header>
  );
}

export default Home