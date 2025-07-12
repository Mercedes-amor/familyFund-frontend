function Container(props) {

    //Este componente envuelve para dar estilos

    const containerStyles = {

        backgroundColor: "rgb(37, 141, 167)",
        color: "white",
        borderRadius: "10px",
        padding: "10px",
        margin: "10px"

    }

    return (
        <div style={containerStyles}> 
            {props.children}
        </div>
    )

}

export default Container;