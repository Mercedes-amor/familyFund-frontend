import { useEffect, useState } from "react";


function ListaUsuarios() {
const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/usuarios")
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar usuarios");
        return res.json();
      })
      .then(data => setUsuarios(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <ul>
        {usuarios.map(u => (
          <li key={u.id}>
            {u.nombre} {u.apellido} {u.edad} - {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaUsuarios;
