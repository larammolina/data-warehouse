const { companiaSchema } = require('../models/companias');

// Consultar Regions
async function consultarCompania() {
    try {
        let companias = await companiaSchema.find({}, { __v: 0 }).populate(
            {
                path: 'ciudades',
                strictPopulate: false,
                select: 'nombre'
            }
        );
        return companias;
    } catch (error) {
        console.log("Error consultando Companias: " + error);
    }
};

// Crear Compania
async function crearCompania(_compania) {
    try {
        const nuevaCompania = new companiaSchema(_compania);
        const { _id } = await nuevaCompania.save();
        console.log("Se creo Compania OK! ID: " + _id);
        return _id;
    } catch (error) {
        console.log("Error creando la compania: " + error);
    }
};

//Eliminar compania
async function eliminarCompania(id) {
    try {
        if (id) {
            let companiaEliminada = await companiaSchema.findByIdAndDelete(id);
            if(companiaEliminada) {
                console.log("Se eliminio la compania OK ");
                return companiaEliminada;
            }else{
                console.log("Error eliminando ID compania ");
            }
        }
    } catch (error) {
        console.log("Error borrando region... " + error);
    }
};

// Actualizar compania
async function actualizarCompania(_compania, id) {
    try {
        let companiaActualizada = await companiaSchema.updateOne(id, _compania);
        //console.log("Compania actualz. "+regionActualizada)
        if (companiaActualizada) {
            //console.log("Se actualizo region OK!");
            return companiaActualizada;
        }
    } catch (error) {
        console.log("Error actualizando Region: " + error);
    }
};

module.exports = { consultarCompania, crearCompania, eliminarCompania, actualizarCompania };