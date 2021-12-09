const usuarioInput = document.getElementById("usuario");
const nombreInput = document.getElementById("nombre");
const apellidoInput = document.getElementById("apellido");
const emailInput = document.getElementById("email");
const perfilInput = document.getElementById("perfil");
const passwordInput = document.getElementById("password");
const password2Input = document.getElementById("password2");
const createBtn = document.getElementById("btn-crear");

const token = JSON.parse(localStorage.getItem('token'));
const profile = JSON.parse(localStorage.getItem('profile'));

let usuarios = [];
const SERVER_URL = "http://localhost:3022";

verificarProfile();

async function verificarProfile(){
    if(!token){
        localStorage.removeItem('token');
        location.href = "/";
    }else{
        if(profile == "admin"){
            console.log("Soy admin")
        }else{
            //nav
            var element = document.getElementById("usuariosMenu");
            element.classList.add("ocultar");
            //footer
            var element2 = document.getElementById("usuariosMenuFooter");
            element2.classList.add("ocultar");
        }
    }
}

//listeners
// Create User listener
createBtn.addEventListener('click', createUser);

function agregarUsuarioAlCombo(usuarios){
    let str = "";
    for (let i=0; i<usuarios.length; i++) {
        str += "<option value='" + usuarios[i]._id + "'>" + usuarios[i].username + "</option>"
    }
    document.getElementById("usuarios2").innerHTML = str;
    //agregarPaises(regiones[0]._id)
    document.getElementById("usuarios3").innerHTML = str;

}


function validarPassword (){
    pass1 = document.getElementById("password");
    pass2 = document.getElementById("password2");

    if (pass1.value != pass2.value) {
        console.log("Las contraseñas deben ser iguales");
        return false;
    } else {
        return true;
    }
}


async function createUser(event) {
    event.preventDefault();
    
    if(usuarioInput.value && emailInput.value && passwordInput.value && nombreInput.value && apellidoInput.value && perfilInput.value){
        if(validarPassword()){
            try {
                let user = {
                    username: usuarioInput.value,
                    email: emailInput.value,
                    password: passwordInput.value,
                    nombre: nombreInput.value,
                    apellido: apellidoInput.value,
                    perfil: perfilInput.options[perfilInput.selectedIndex].value
                    
                };
                console.log(user);
                
                let userCreate = await fetch(`${SERVER_URL}/user/altaUsuario`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json', 
                        "access-token": `${token}`
                    },
                    body: JSON.stringify(user)
                    
                });
            
                let userCreated = await userCreate.json();

                
                if(userCreate.status == 401){  //es pq no estoy logueado o JWT vencido
                    console.log("Error 401.... Error con al info enviada");
                }else if(userCreate.status == 402){
                    console.log("Error 402... El usuario ya existe");
                    alert("Error 402... El usuario ya existe!") 
                }else if(userCreate.status == 200){
                    console.log(userCreated);
                    alert("Usuario creado con exito!") 
                    location.href="";
                }
                
        
            } catch (error) {
                console.log("Error al dar de alta el usuario");
            }
        }else{
            alert("Error, las contraseñas no coinciden!") 
        }
        
    }else{
        console.log("Error... Faltan datos...")
        alert("Error, todos los campos deben se completados!")
    }
    
};


async function cargarUsuarios(){ 
    if(!token){
        localStorage.removeItem('token');
        location.href = "/";
    }else{
        try {
            let cargarUsuario = await fetch(`${SERVER_URL}/user/consultaUsuarios`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json', 
                    "access-token": `${token}`
                },
                //body: JSON.stringify()
            });
            let usuario_cargada = await cargarUsuario.json();
            if(cargarUsuario.status == 401){  //es pq no estoy logueado o JWT vencido
                
            }else if(cargarUsuario.status == 200){
                if (usuario_cargada) {
                    
                    for(i in usuario_cargada.datos){
                        //imprimo las regiones por pantalla
                        console.log(usuario_cargada.datos[i].nombre);
                        usuarios[i] = usuario_cargada.datos[i]; 
                    }
                    //console.log(regiones.length);
                    agregarUsuarioAlCombo(usuarios);
                }
            } else {
                console.log("ERROR....");
            }
        } catch (error) {
            console.log(error);
        }
    }
}


cargarUsuarios();


async function modificarUsuario(){
    let seleccionada = document.getElementById("usuarios2");
    let nuevoNombre = document.getElementById('nombre2').value;
    let nuevoApellido = document.getElementById('apellido2').value;
    let nuevoMail = document.getElementById('email2').value;

    seleccionada = seleccionada.options[seleccionada.selectedIndex].value;


    console.log('usuario seleccionado:'+seleccionada);
    console.log('usuario nueva:'+nuevoNombre+nuevoApellido+nuevoMail);
    //seleccionada = "1233"

    try {
        let usuarios = {
            nombre: nuevoNombre,
            apellido: nuevoApellido,
            mail: nuevoMail,
        };
        console.log(usuarios);
        let editar_compania = await fetch(`${SERVER_URL}/user/actualizarUsuarios/${seleccionada}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
                "access-token": `${token}`
            },
            body: JSON.stringify(usuarios)
        });
        let usuario_editado = await editar_compania.json();
        if(usuario_editado.status == 401){  //es pq no estoy logueado o JWT vencido
            console.log("Error 401 agregando usuario modificado...")
        }else if(usuario_editado.status == 200){
            console.log("Se Agrego OK!!")
        } else {
            console.log("ERROR....");
        }
    } catch (error) {
        console.log(error);
    }

}

async function eliminarUsuario(){
    let seleccionada = document.getElementById("usuarios3");
    seleccionada = seleccionada.options[seleccionada.selectedIndex].value;
    console.log('usuario seleccionado: ' + seleccionada);

    try {
        let eliminar_compania = await fetch(`${SERVER_URL}/user/eliminarUsuarios/${seleccionada}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
                "access-token": `${token}`
            },
            //body: JSON.stringify(region)
        });
        let compania_eliminada = await eliminar_compania.json();
        if(compania_eliminada.status == 401){  //es pq no estoy logueado o JWT vencido
            console.log("Error 401 eliminando usuario...")
        }else if(compania_eliminada.status == 200){
            console.log("Se elimino OK!!")
        } else {
            console.log("ERROR....");
        }
    } catch (error) {
        console.log(error);
    }

}