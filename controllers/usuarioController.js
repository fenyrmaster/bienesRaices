import { check, validationResult } from "express-validator"
import { generarId } from "../helpers/tokens.js"

import Usuario from "../models/Usuario.js"

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

// Registrar a los nuevos usuarios
const registrar = async (req, res) => {
    //Validar informacion
    await check('nombre').notEmpty().withMessage("El nombre no puede ir vacio").run(req);
    await check('email').isEmail().withMessage("Eso no parece un email").run(req);
    await check('password').isLength({min: 6}).withMessage('El Password debe ser de al menos 6 caracteres').run(req);
    await check('repetir_password').equals(req.body.password).withMessage('Los passwords no son iguales').run(req);

    let resultado = validationResult(req);

    // Veirificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })
    }

    //Verificar que el usuario este verificado
    const existeUsuario = await Usuario.findOne({ where: {email: req.body.email} });
    if(existeUsuario){
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: [{msg: 'El usuario ya esta registrado con ese correo'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })
    }

    //Creamos el nuevo usuario
    const usuario = await Usuario.create({
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password,
        token: generarId()
    });

    //Creamos una pagina que pide al usuario autenticarse por correo
    res.render('templates/mensajes', {
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un email de confirmacion, presiona en el enlace'
    })

}

export {
    formularioLogin,
    formularioRegister,
    formularioForgotPassword,
    registrar
}