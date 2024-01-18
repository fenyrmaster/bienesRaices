import Precio from "../models/Precio";
import Categoria from "../models/Categoria";

const admin = (req, res) => {
    res.render("propiedades/admin", {
        pagina: 'Mis Propiedades',
        barra: true
    })
}

//Formulario para crear una nueva propiedad
const crear = async (req, res) => {
    // Consultar Model de precios y categorias
    const [categorias, precios] = await Promise.all([Categoria.findAll(), Precio.findAll()]);

    res.render("propiedades/crear", {
        pagina: 'Crear Propiedad',
        barra: true,
        categorias,
        precios
    })}

export {
    admin,
    crear
}