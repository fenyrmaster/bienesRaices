import app from "./app.js";

const port = 3000;

//Inicializar el servidor
app.listen(port, () => {
    console.log("El servidor sirve");
})