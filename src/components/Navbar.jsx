import { NavLink } from "react-router-dom";

function Navbar() {

    const checkActiveUrl = (info) => {
        // console.log(info)

        if (info.isActive) {
            return "nav-active"
        }
    }
  return (
    <nav>
        <NavLink className={checkActiveUrl} to="/">Home</NavLink>
        <NavLink className={checkActiveUrl} to="/about">Servidor</NavLink>
        <NavLink className={checkActiveUrl} to="/profile/Mercedes">Profile</NavLink>
        <NavLink className={checkActiveUrl} to="/error">Error</NavLink>
        <NavLink className={checkActiveUrl} to="/notFound">NotFound</NavLink>
        <NavLink className={checkActiveUrl} to="/login">Login</NavLink>
        <NavLink className={checkActiveUrl} to="/signup">Signup</NavLink>


    </nav>
  )
}

export default Navbar