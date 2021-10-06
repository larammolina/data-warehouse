const { ciudadSchema, paisSchema, regionSchema } = require('../models/regiones');

// Create Region
async function crearRegion(region) {
    try {
        console.log("NEW REGION -| "+ region)
        const nuevaRegion = new regionSchema(region);
        const { _id } = await nuevaRegion.save();
        console.log("Se creo region OK! ID: " + _id);
        return _id;
    } catch(error) {
        console.log("Error creando la region: " + error);
    }
};

// Get Regions
async function consultarRegiones() {
    try {
        let regiones = await regionSchema.find({}, {__v:0}).populate(
            {
                path: 'pais ciudad',
                strictPopulate: false,
                select: 'nombre',
                populate: {
                    path: 'ciudad',
                    select: 'nombre'
                }
            }
        );
        return regiones;
    } catch(error) {
        console.log("Error consultando Region: " + error);
    }
};

// Update an existing Region
async function actualizarRegion(region, id) {
    try {
        let regionActualizada = await regionSchema.updateOne(id, region);
        if (regionActualizada) {
            console.log("Se actualizo region OK!");
            return regionActualizada;
        }
    } catch (error) {
        console.log("Error actualizando Region: " + error);
    }
};

// Delete an existing Region
async function eliminarRegion(id) {
    try {
        // Search for the region
        let { paises } = await regionSchema.findOne(id);

        // Before deleting the region, first I need to delete each city that belongs to the country, and finally the country
        paises.forEach(async (paisesId) => {
            // Find the ids of the cities on each country inside the region
            let { ciudades } = await paisesSchema.findById(paisesId);

            // Delete each city
            ciudades.forEach(async (ciudadId) => {
                await ciudadesSchema.findByIdAndDelete(ciudadesId);
            });

            // Finally, delete the Country
            await paisesSchema.findByIdAndDelete(paisesId);
        });

        // Now I can delete the Region
        let regionBorrar = await regionSchema.findByIdAndDelete(id);

        if (regionBorrar) {
            console.log("[INFO] Region successfully deleted!");
            return regionBorrar;
        }
    } catch (error) {
        console.log("[ERROR] There was an error while trying to delete the Region, error msg: " + error.message);
    }
};

module.exports = { crearRegion, consultarRegiones, actualizarRegion, eliminarRegion };