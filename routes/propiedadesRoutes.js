import express from 'express'
import { admin } from '../controllers/propiedadController.js';

const routerPropiedades = express.Router();

//Ruta principal, las propiedades del usuario
routerPropiedades
    .route("/mis-propiedades")
    .get(admin)

export default routerPropiedades;