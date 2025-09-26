//PENDIENTE DE IMPLEMENTAR
//Rutas protegidas que se rederigirán al /login

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

//Rutas que estárán protegidas, necesario authentication
function ProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <p>Cargando...</p>; // mientras verifica sesión
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
