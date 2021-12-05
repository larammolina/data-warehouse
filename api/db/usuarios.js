const User = require("./../models/usuarios");

// Consultar usuarios
async function consultarUsuarios() {
    try {
        let usuarios = await User.find({}, { __v: 0,  password: 0});
        return usuarios;
    } catch (error) {
        console.log("Error consultando usuarios: " + error);
    }
};

// Consultar usuarios
async function actualizarUsuarios(_usuario, id) {
    try {
        let usuarios = await User.updateOne(id, _usuario);
        return usuarios;
    } catch (error) {
        console.log("Error consultando usuarios: " + error);
    }
};

//Eliminar compania
async function eliminarUsuario(id) {
    try {
        if (id) {
            let usuarioEliminado = await User.findByIdAndDelete(id);
            if(usuarioEliminado) {
                console.log("Se eliminio el contacto OK ");
                return usuarioEliminado;
            }else{
                console.log("Error eliminando el contacto... ");
            }
        }
    } catch (error) {
        console.log("Error borrando el contacto... " + error);
    }
};

// export model user with UserSchema
module.exports = {
    consultarUsuarios,
    actualizarUsuarios,
    eliminarUsuario
} 