import { check, validationResult } from "express-validator"
import { generarId, generarJWT } from "../helpers/tokens.js"
import jwt from "jsonwebtoken";
import { emailOlvidePassword, emailRegistro } from "../helpers/email.js"
import bcrypt from 'bcrypt';

import Usuario from "../models/Usuario.js"

//Renderizar formulario para iniciar sesion
const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesion',
        csrfToken: req.csrfToken(),
    })
}

//Renderizar formulario para registrarse
const formularioRegister = (req, res) => {

    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    })
}

//Renderizar formulario para recuperar contraseña
const formularioForgotPassword = (req, res) => {
    res.render('auth/forgotPassword', {
        csrfToken: req.csrfToken(),
        pagina: 'Recuperar mi cuenta a Bienes Raices'
    })
}

const resetPassword = async (req, res) => {
    //Validar informacion de correo
    await check('email').isEmail().withMessage("Eso no parece un email").run(req);

    let resultado = validationResult(req);

    // Veirificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/forgotPassword', {
            pagina: 'Recuperar mi cuenta a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    // Buscar que el correo exista
    const usuario = await Usuario.findOne({ where: { email: req.body.email } });
    if(!usuario){
        return res.render('auth/forgotPassword', {
            pagina: 'Recuperar mi cuenta a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El email no pertenece a ningun usuario'}],
        })
    }

    // Generar un token y enviar el email
    usuario.token = generarId();
    await usuario.save();

    //Enviar un email y generar un mensaje
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    });

    res.render('templates/mensajes', {
        pagina: 'Solicitud aceptada correctamente',
        mensaje: 'Hemos enviado un email de confirmacion, presiona en el enlace'
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
            csrfToken: req.csrfToken(),
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
            csrfToken: req.csrfToken(),
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

    //Envia email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //Creamos una pagina que pide al usuario autenticarse por correo
    res.render('templates/mensajes', {
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un email de confirmacion, presiona en el enlace'
    })

}

//Funcion que comprueba y confirma una cuenta
const confirmarCuenta = async (req, res) => {
    const { token } = req.params;

    //Verificar si el token es valido
    const usuario = await Usuario.findOne({ where: {token} });
    if(!usuario){
        return res.status(200).render('auth/confirmarCuenta', {
            error: true,
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo'
        })
    }

    //Confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    res.render('auth/confirmarCuenta', {
        pagina: 'Cuenta Confirmada',
        mensaje: 'La cuenta se confirmo correctamente',
        error: false
    });
}

const comprobarToken = async (req, res, next) => {
    const { token } = req.params;
    const usuario = await Usuario.findOne({ where: { token } });
    if(!usuario){
        return res.render('auth/confirmarCuenta', {
            pagina: 'Reestablece tu password',
            mensaje: 'Hubo un error al validar tu informacion, intenta de nuevo',
            error: true
        });
    }

    //Mostrar el formulario para modificar el password
    res.render('auth/reset-password', {
        pagina: 'Reestablece tu password',
        csrfToken: req.csrfToken(),
    })
}

const nuevoPassword = async (req, res) => {
    // Validar el password
    await check('password').isLength({min: 6}).withMessage('El Password debe ser de al menos 6 caracteres').run(req);

    let resultado = validationResult(req);

    // Veirificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/reset-password', {
            pagina: 'Reestablece tu password',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    const { token } = req.params;
    const { password } = req.body;

    // Identificar quien hace el cambio
    const usuario = await Usuario.findOne({where: { token }});
    
    //Hashear el password
    const salt = await bcrypt.genSalt(12);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;

    await usuario.save();

    res.render('auth/confirmarCuenta', {
        pagina: 'Contraseña reestablecido',
        mensaje: 'La contraseña se guardo correctamente'
    });
}

const autenticar = async (req, res) => {
    await check('email').isEmail().withMessage("El email es obligatorio").run(req);
    await check('password').notEmpty().withMessage('El Password es obligatorio').run(req);

    let resultado = validationResult(req);

    // Veirificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    const {email, password} = req.body;
    
    //Comprobar si el usuario existe
    const usuario = await Usuario.findOne({ where: { email } });
    if(!usuario){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario no existe'}],
        })
    }

    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Tu cuenta no ha sido confirmada'}],
        })
    }

    // Revisar el password
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'La contraseña es incorrecta'}],
        })
    }

    // Autenticar al usuario
    const token = generarId({ id: usuario.id, nombre: usuario.nombre });

    //Almacenar en un cookie
    return res.cookie('_token', token, {
        httpOnly: true,
        //secure: true

    }).redirect("/mis-propiedades")
}

export {
    formularioLogin,
    formularioRegister,
    formularioForgotPassword,
    registrar,
    confirmarCuenta,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    autenticar
}