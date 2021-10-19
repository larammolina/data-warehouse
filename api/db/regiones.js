const { ciudadSchema, paisSchema, regionSchema } = require('../models/regiones');

// Create Region
async function crearRegion(region) {
    try {
        console.log("NEW REGION -| " + region)
        const nuevaRegion = new regionSchema(region);
        const { _id } = await nuevaRegion.save();
        console.log("Se creo region OK! ID: " + _id);
        return _id;
    } catch (error) {
        console.log("Error creando la region: " + error);
    }
};

// Get Regions
async function consultarRegiones() {
    try {
        let regiones = await regionSchema.find({}, { __v: 0 }).populate(
            {
                path: 'paises ciudades',
                strictPopulate: false,
                select: 'nombre',
                populate: {
                    path: 'ciudades',
                    select: 'nombre'
                }
            }
        );
        return regiones;
    } catch (error) {
        console.log("Error consultando Region: " + error);
    }
};

// Update an existing Region
async function actualizarRegion(region, id) {
    try {
        let regionActualizada = await regionSchema.updateOne(id, region);
        console.log("Regio actualz. "+regionActualizada)
        if (regionActualizada) {
            console.log("Se actualizo region OK!");
            return regionActualizada;
        }
    } catch (error) {
        console.log("Error actualizando Region: " + error);
    }
};

async function eliminarRegion(id) {
    /*
    1- busco los paises asociados al ID region.
    2- busco las cuidades asociadas al ID paises.

    3- Borro las ciudades por ID.
    4- Borro los paises por ID
    5- Borro la region
    */
    try {
        //console.log("ID A BORRAR " + id);
        let { paises } = await regionSchema.findOne(id);
        //console.log("PAISES: "+ paises);
        //Primero busco el pais
        paises.forEach(async (paisesId) => {
            
            console.log("PAISES: "+ paisesId);
            //con los paises saco las ciudades, para borrar los IDs primerp
            let { ciudades } = await paisSchema.findById(paisesId);
            ciudades.forEach(async (ciudadId) => {
                
                console.log("CAIUDAD: "+ ciudadId);
                await ciudadSchema.findByIdAndDelete(ciudadId); //Borro las ciudades por ID
            });
            
            //despues borro el pais.
            await paisSchema.findByIdAndDelete(paisesId);
        });
        
        // borro la Region
        let regionBorrar = await regionSchema.findByIdAndDelete(id);
        console.log("LLEgue hasta aca... " + regionBorrar + " id " + id)

        if (regionBorrar) {
            console.log("Region Borrada OK!");
            return regionBorrar;
        }else{
            console.log("Error borrando region-----!");
        }
    } catch (error) {
        console.log("Error borrando region... " + error);
    }
};

module.exports = { crearRegion, consultarRegiones, actualizarRegion, eliminarRegion };