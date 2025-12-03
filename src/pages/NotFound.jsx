function NotFound() {
  return (
    <div 
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ 
        height: "70vh",
        textAlign: "center",
        padding: "20px"
      }}
    >
      <h1 style={{ fontSize: "100px", fontWeight: "700" }}>404</h1>
      <h2 style={{ fontSize: "32px", marginBottom: "10px" }}>
        Página no encontrada
      </h2>

      <p style={{ maxWidth: "400px", opacity: 0.7 }}>
        La página que buscas no existe o ha sido movida.
      </p>

      <a 
        href="/" 
        className="btn btn-primary mt-3 px-4 py-2"
        style={{ backgroundColor: "#00A6C4", borderRadius: "12px", fontSize: "18px" }}
      >
        Volver al inicio
      </a>
    </div>
  );
}

export default NotFound;
