import { Link } from "react-router-dom"

function Error() {
  return (
    <div>
      <h3>Se ha producido un error, vuelve al inicio</h3>
      <Link to="/">Volver</Link>
    </div>
  )
}

export default Error