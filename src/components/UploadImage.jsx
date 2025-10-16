import { useState, useEffect } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export default function UploadImage({ currentUrl, onUpload }) {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(currentUrl || "");
const [showForm, setShowForm] = useState(!currentUrl || currentUrl === "");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Selecciona un archivo primero");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir imagen");

      const data = await res.json();
      setUrl(data.secure_url);
      setShowForm(false); // ocultar form al subir
      if (onUpload) onUpload(data.secure_url); // notificar a Profile
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="upload-image-container">
      {url && (
        <div className="profile-photo">
          <img src={url} alt="Foto de perfil" width="200" className="profile-img"/>
          <button className="general-AddButton" onClick={() => setShowForm(true)}>
            Cambiar foto
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleUpload} className="upload-form">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button type="submit" className="general-AddButton">
            Subir
          </button>
        </form>
      )}
    </div>
  );
}
