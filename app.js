import express from "express";
import routerUsers from "./routes/usuarioRoutes.js";
import db from "./config/db.js";

const app = express();

//Conexion a la DB
try{
    await db.authenticate();
    console.log('Conexion correcta');
} catch(error){
    console.log(error);
}

// Habilitar PUG
app.set('view engine', 'pug');
app.set('views', './views');

//Carpeta publica
app.use(express.static('public'));

//Permitir el envio del body (body parser)
app.use(express.json({limit: "20kb"}));

//Rutas para los usuarios
app.use("/auth", routerUsers);

export default app;