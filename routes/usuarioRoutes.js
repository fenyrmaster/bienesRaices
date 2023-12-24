import express from "express";
import { formularioLogin, formularioRegister } from "../controllers/usuarioController.js";

const routerUsers = express.Router();

//Ruta para iniciar sesion
routerUsers
    .route("/login")
    .get(formularioLogin)

//Ruta para registrarse
routerUsers
    .route("/register")
    .get(formularioRegister)

export default routerUsers;