const { contactoSchema } = require('../models/contactos');

// Consultar Contactos
async function consultarContactos() {
    try {
        let contactos = await contactoSchema.find({}, { __v: 0 }).populate(
            {
                path: 'compania region pais ciudad',
                strictPopulate: false,
                select: 'nombre'
            }
        );
        return contactos;
    } catch (error) {
        console.log("Error consultando contactos: " + error);
    }
};

// Crear Compania
async function crearContactos(_contactos) {
    try {
        const nuevoContacto = new contactoSchema(_contactos);
        const { _id } = await nuevoContacto.save();
        console.log("Se creo el contacto OK! ID: " + _id);
        return _id;
    } catch (error) {
        console.log("Error creando el contacto: " + error);
    }
};

//Eliminar compania
async function eliminarContacto(id) {
    try {
        if (id) {
            let contactoEliminado = await contactoSchema.findByIdAndDelete(id);
            if(contactoEliminado) {
                console.log("Se eliminio el contacto OK ");
                return contactoEliminado;
            }else{
                console.log("Error eliminando el contacto... ");
            }
        }
    } catch (error) {
        console.log("Error borrando el contacto... " + error);
    }
};

// Actualizar compania
async function actualizarContacto(_contacto, id) {
    console.log(_contacto)
    try {
        let contactoActualizado = await contactoSchema.updateOne(id, _contacto);
        //console.log("Compania actualz. "+regionActualizada)
        if (contactoActualizado) {
            //console.log("Se actualizo region OK!");
            return contactoActualizado;
        }
    } catch (error) {
        console.log("Error actualizando contacto: " + error);
    }
};

async function buscarContactos(campo, orden, valor) {
    try {
        
        let busqueda = await contactoSchema.find( { [campo]: { $regex: `${valor}` } } , {__v:0}).populate({
            path: 'compania region pais ciudad',
            strictPopulate: false,
            select: 'nombre'
        }
        ).sort({[campo]: [orden]});
        return busqueda;
    } catch (error) {
        console.log("Error buscando contactos... " + error.message);
    }
};

module.exports = { consultarContactos, crearContactos, eliminarContacto, actualizarContacto, buscarContactos };