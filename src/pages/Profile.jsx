import { useParams } from "react-router-dom"

function Profile() {

    const params = useParams();

    console.log(params)
  return (
    <div>
        <h3>Perfil del usuario de id: {params.userId}</h3>
        <p>Aquí aparece datos del usuario actual</p>
    </div>
  )
}

export default Profile