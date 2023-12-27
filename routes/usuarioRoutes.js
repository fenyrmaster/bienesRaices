import express from "express";
import { formularioForgotPassword, formularioLogin, formularioRegister } from "../controllers/usuarioController.js";

const routerUsers = express.Router();

//Ruta para iniciar sesion
routerUsers
    .route("/login")
    .get(formularioLogin)

//Ruta para registrarse
routerUsers
    .route("/register")
    .get(formularioRegister)

//Ruta para recuperar password
routerUsers
    .route("/forgotPassword")
    .get(formularioForgotPassword)

export default routerUsers;