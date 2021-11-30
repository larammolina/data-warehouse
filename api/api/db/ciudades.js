const { ciudadSchema, paisSchema, regionSchema } = require('../models/regiones');

async function crearCiudad(ciudad, id) {
    console.log("creando caiudad...")
    try {
        //primero busco el pais con el ID
        console.log("Pais: " + id._id)
        let pais = await paisSchema.findById(id);
        console.log("Pais: " + pais)
        
        if (pais) {
            let existeCiudad = await ciudadSchema.find(ciudad);
            console.log("Existe Ciudad??: " + existeCiudad)
            if (existeCiudad != '') {
                //ERROR YA EXISTE EL PAIS
                console.log("ERROR, la ciudad ya existe...");
                throw "ERROR, la ciudad ya existe...";
            } else {
                let nuevaCiudad = new ciudadSchema(ciudad);   //creo un nuevo pais
                let { _id } = await nuevaCiudad.save();  //lo guardo y me quedo con el id
                console.log("Caiudad ID: " + _id);
                await pais.ciudades.push(nuevaCiudad);      //
                await pais.save();                    //guardo las modificaciones en las regiones
                console.log("Ciudad creado OK! -- ID: " + _id);
                return nuevaCiudad;
            }
        } else {
            console.log("ERROR, ID incorrecto...");
            throw "ERROR, ID incorrecto...";
            //ERROR CON EL ID...
        }
    } catch (error) {
        console.log("ERROR, creando la ciudad... " + error);
    }
};

async function actualizarCiudad(ciudad, id) {
    try {
        let ciudadActualizado = await ciudadSchema.updateOne(id, ciudad);
        if (ciudadActualizado) {
            console.log("Ciudad Actualizado!");
            return ciudadActualizado;
        }
    } catch (error) {
        console.log("ERROR actualizando Ciudad: " + error);
    }
};

async function eliminarCiudad(id) {
    try {
        let ciudadEliminada = await ciudadSchema.findByIdAndDelete(id);
        if (ciudadEliminada) {
            return ciudadEliminada;
        } else {
            console.log("Error>! ese id esta mal...");
        }
    } catch (error) {
        console.log("error eliminando ciduad: " + error);
    }
};

module.exports = { crearCiudad, actualizarCiudad, eliminarCiudad };