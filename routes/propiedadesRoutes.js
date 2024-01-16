import express from 'express'
import { admin, crear } from '../controllers/propiedadController.js';

const routerPropiedades = express.Router();

//Ruta principal, las propiedades del usuario
routerPropiedades
    .route("/mis-propiedades")
    .get(admin)

//Ruta para crear propiedades
routerPropiedades
    .route("/mis-propiedades/crear")
    .get(crear)

export default routerPropiedades;