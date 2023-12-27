
//Renderizar formulario para iniciar sesion
const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar sesion'
    })
}

//Renderizar formulario para registrarse
const formularioRegister = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta'
    })
}

//Renderizar formulario para recuperar contraseña
const formularioForgotPassword = (req, res) => {
    res.render('auth/forgotPassword', {
        pagina: 'Recuperar mi cuenta a Bienes Raices'
    })
}

export {
    formularioLogin,
    formularioRegister,
    formularioForgotPassword
}