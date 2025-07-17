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
        <NavLink className={checkActiveUrl} to="/about">About</NavLink>
        <NavLink className={checkActiveUrl} to="/profile">Profile</NavLink>
        <NavLink className={checkActiveUrl} to="/error">Error</NavLink>
        <NavLink className={checkActiveUrl} to="/notFound">NotFound</NavLink>


    </nav>
  )
}

export default Navbar