import express from "express";
import { formularioForgotPassword, formularioLogin, formularioRegister, registrar, confirmarCuenta } from "../controllers/usuarioController.js";

const routerUsers = express.Router();

//Ruta para iniciar sesion
routerUsers
    .route("/login")
    .get(formularioLogin)

//Ruta para registrarse
routerUsers
    .route("/register")
    .get(formularioRegister)
    .post(registrar)

//Ruta para recuperar password
routerUsers
    .route("/forgotPassword")
    .get(formularioForgotPassword)

//Ruta para confirmar nuestra cuenta
routerUsers
    .route("/confirmar/:token")
    .get(confirmarCuenta)

export default routerUsers;