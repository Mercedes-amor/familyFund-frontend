import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

//Iconos
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faEdit,
  faTrashArrowUp,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export default function UploadImage({ currentUrl, onUpload }) {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(currentUrl || "");
  const [showForm, setShowForm] = useState(!currentUrl || currentUrl === "");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.warning("seleccione un archivo primero");
    // alert("Selecciona un archivo primero");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/upload/upload-photo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // si usas JWT
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir imagen");

      // Desde backend devolvemos un UsuarioDto con "photoUrl"
      const data = await res.json();

      // ACtualizamos el estado local con la nueva URL
      setUrl(data.photoUrl);
      setShowForm(false);

      // Notifica al componente padre (Profile, etc.)
      if (onUpload) onUpload(data.photoUrl);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      // alert("No se pudo subir la imagen");
      toast.error("No se pudo subir la imagen");
    }
  };

  return (
    <div className="upload-image-container">
      {url && (
        <div className="profile-photo">
          <img
            src={url}
            alt="Foto de perfil"
            width="200"
            className="profile-img"
          />
          <FontAwesomeIcon
            icon={faEdit}
            style={{ cursor: "pointer", color: "#105c53", fontSize: "1.1rem"}}
            onClick={() => setShowForm(true)}
          />
        </div>
      )}

      {showForm && (
        <form onSubmit={handleUpload} className="upload-form">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <div className="nameFormBtn">
            {/* ICONO CONFIRMAR */}
            <FontAwesomeIcon
              icon={faCheck}
              style={{
                cursor: "pointer",
                fontSize: "1.5rem",
                marginLeft: "8px",
              }}
              onClick={() => {
                // Disparar submit como si fuera el botón
                handleUpload(new Event("submit"));
              }}
            />
            {/* ICONO CANCELAR */}
            <FontAwesomeIcon
              icon={faXmark}
              style={{
                cursor: "pointer",
                fontSize: "1.5rem",
                marginLeft: "8px",
                color: "red",
              }}
              onClick={() => {
                setFile(null); // vaciar archivo
                setShowForm(false); // cerrar formulario
              }}
            />
          </div>
        </form>
      )}
    </div>
  );
}
