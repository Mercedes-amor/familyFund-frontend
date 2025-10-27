// Footer.jsx
const Footer = () => {
  const year = new Date().getFullYear(); // Año actual dinámico

  return (
    <footer className="footer">
      &copy; {year} Familyfund - Mercedes Amor Gallart.
    </footer>
  );
};

export default Footer;
