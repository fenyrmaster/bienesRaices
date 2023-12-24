import express from "express";
import routerUsers from "./routes/usuarioRoutes.js";

const app = express();

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