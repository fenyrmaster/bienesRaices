
//Renderizar formulario para iniciar sesion
const formularioLogin = (req, res) => {
    res.render('auth/login', {
        
    })
}

//Renderizar formulario para registrarse
const formularioRegister = (req, res) => {
    res.render('auth/registro', {
        
    })
}

export {
    formularioLogin,
    formularioRegister
}