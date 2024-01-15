import express from "express";
import routerUsers from "./routes/usuarioRoutes.js";
import db from "./config/db.js";
import csrf from 'csurf'
import cookieParser from "cookie-parser";
import routerPropiedades from "./routes/propiedadesRoutes.js";

const app = express();

//Conexion a la DB
try{
    await db.authenticate();
    db.sync();
    console.log('Conexion correcta');
} catch(error){
    console.log(error);
}

//Permitir el envio del body (body parser)
app.use(express.urlencoded({ extended: true }));

//Habilitar cookie parser
app.use(cookieParser());

//Habilitar CSRF
app.use(csrf({cookie: true}));

app.use(express.json({limit: "20kb"}));

// Habilitar PUG
app.set('view engine', 'pug');
app.set('views', './views');

//Carpeta publica
app.use(express.static('public'));

//Rutas para los usuarios
app.use("/auth", routerUsers);
app.use("/", routerPropiedades)

export default app;