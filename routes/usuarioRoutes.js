import express from "express";
import { formularioForgotPassword, formularioLogin, formularioRegister, registrar, confirmarCuenta, resetPassword, comprobarToken, nuevoPassword, autenticar } from "../controllers/usuarioController.js";

const routerUsers = express.Router();

//Ruta para iniciar sesion
routerUsers
    .route("/login")
    .get(formularioLogin)
    .post(autenticar)

//Ruta para registrarse
routerUsers
    .route("/register")
    .get(formularioRegister)
    .post(registrar)

//Ruta para recuperar password
routerUsers
    .route("/forgotPassword")
    .get(formularioForgotPassword)
    .post(resetPassword)

//Ruta para confirmar nuestra cuenta
routerUsers
    .route("/confirmar/:token")
    .get(confirmarCuenta)

routerUsers
    .route("/olvide-password/:token")
    .get(comprobarToken)
    .post(nuevoPassword)

export default routerUsers;