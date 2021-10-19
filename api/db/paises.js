const { ciudadSchema, paisSchema, regionSchema } = require('../models/regiones');

// Create Region
async function crearPais(pais, id) { 
    console.log("creando pais...")
    try {
        //primero busco la region con el ID
        let region = await regionSchema.findById(id);
        console.log("Region: " + region)
        if (region) {
            let existePais = await paisSchema.find(pais);
            console.log("Existe Pais??: " + existePais)
            if (existePais != '') {
                //ERROR YA EXISTE EL PAIS
                console.log("ERROR, el pais ya existe...");
                throw "ERROR, el pais ya existe...";
            } else {
                let nuevoPais = new paisSchema(pais);   //creo un nuevo pais
                let { _id } = await nuevoPais.save();  //lo guardo y me quedo con el id
                console.log("Pais ID: " + _id);
                await region.paises.push(nuevoPais);      //
                await region.save();                    //guardo las modificaciones en las regiones
                console.log("Pais creado OK! -- ID: " + _id);
                return nuevoPais;
            }
        } else {
            console.log("ERROR, ID incorrecto...");
            throw "ERROR, ID incorrecto...";
            //ERROR CON EL ID...
        }
    } catch (error) {
        console.log("ERROR, creando la pais... " + error);
    }
};

async function actualizarPais(pais, id) {
    try {
        let paisActualizado = await paisSchema.updateOne(id, pais);
        if (paisActualizado) {
            console.log("Pais Actualizado!");
            return paisActualizado;
        }
    } catch (error) {
        console.log("ERROR actualizando Pais: " + error);
    }
};

async function eliminarPais(id) {
    try {
        //busco las ciudades asociadas al ID pais
        let { ciudades } = await paisSchema.findOne(id);
        ciudades.forEach(
            async (ciudadID) => {
            await ciudadSchema.findByIdAndDelete(ciudadID); //priemero borro las ciudades asociadas a el pais
        });
        let paisBorrar = await paisSchema.findByIdAndDelete(id);    //despues borro el pais

        if (paisBorrar) {
            console.log("Pais borrado OK!");
            return paisBorrar;
        }
    } catch (error) {
        console.log("ERROR eliminando pais: " + error);
    }
};

module.exports = { crearPais, actualizarPais, eliminarPais };