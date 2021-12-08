const token = JSON.parse(localStorage.getItem('token'));
const profile = JSON.parse(localStorage.getItem('profile'));

const nombreInput = document.getElementById("nombre");
const apellidoInput = document.getElementById("apellido");
const cargoInput = document.getElementById("cargo");
const emailInput = document.getElementById("email");
const companiaInput = document.getElementById("compania2");

const regionInput = document.getElementById("regiones1");
const paisInput = document.getElementById("paises1");
const ciudadInput = document.getElementById("ciudades1");

const direccionInput = document.getElementById("direccion");
const canalInput = document.getElementById("canal");
const cuentaInput = document.getElementById("cuenta");

//const interesInput = document.getElementById("preferencias");


const prefsInput = document.getElementById("preferencias");

let selectBox_regiones1 = document.getElementById("regiones1");
let selectBox_regiones2 = document.getElementById("regiones2");
let selectBox_paises  = document.getElementById("paises1");
let selectBox_paises2 = document.getElementById("paises2");
let createBtn = document.getElementById("btn-crear");
let selectedValue_regiones, selectedValue_paises, selectedValue_regiones1, selectedValue_regiones2, selectedValue_regiones3;


const SERVER_URL = "http://localhost:3022";
let regiones = []
let companias = []
let contactos = []
// Create contact listener
createBtn.addEventListener('click', crearContacto);

async function verificarProfile() {
    if (!token) {
        localStorage.removeItem('token');
        location.href = "/";
    } else {
        if (profile == "admin") {
            console.log("Soy admin PERRI")
        } else {
            var element = document.getElementById("usuariosMenu");
            element.classList.add("ocultar");
        }
    }
}



async function crearContacto(){
    try {
        let contacto = {
            nombre: nombreInput.value,
            apellido: apellidoInput.value,
            cargo: cargoInput.value,
            email: emailInput.value,
            compania: companiaInput.options[companiaInput.selectedIndex].value,
            region: regionInput.options[regionInput.selectedIndex].value,
            pais: paisInput.options[paisInput.selectedIndex].value,
            ciudad: ciudadInput.options[ciudadInput.selectedIndex].value,
            direccion: direccionInput.value,
            canalDeContacto: {
                canal: canalInput.options[canalInput.selectedIndex].value,
                cuentaDeUsuario: cuentaInput.value,
                preferencias: prefsInput.options[prefsInput.selectedIndex].value
            }
            
        };
        console.log(contacto);
        
        let contactoCreate = await fetch(`${SERVER_URL}/contactos/agregarContacto`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
                "access-token": `${token}`
            },
            body: JSON.stringify(contacto)
            
        });
    
        let contactoCreated = await contactoCreate.json();
        
        console.log(contactoCreated);
        if (contactoCreated) {
            //addUserContainer.style.display = 'none';
            //location.reload();
        }
    } catch (error) {
        //errorMessages.textContent = error;
        console.log(error);
        console.log("Error al dar de alta el usuario");
    }

}

//companias

function agregarCompaniaAlCombo(companias){
    let str = "";
    for (let i=0; i<companias.length; i++) {
        str += "<option value='" + companias[i]._id + "'>" + companias[i].nombre + "</option>"
    }
    console.log("agregando companias");
    document.getElementById("compania2").innerHTML = str;
    document.getElementById("compania3").innerHTML = str;
}

async function cargarCompanias() {
    if(!token){
        localStorage.removeItem('token');
        location.href = "/";
    }else{
        try {
            let cargarCompanias = await fetch(`${SERVER_URL}/companias/consultaCompanias`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "access-token": `${token}`
                },
            });
            let companias_cargadas = await cargarCompanias.json();
            //console.log(cargarCompanias.status)
            if(cargarCompanias.status == 401){  //es pq no estoy logueado o JWT vencido
                localStorage.removeItem('token');
                location.href = "/";
            }else if(cargarCompanias.status == 200){
                if (companias_cargadas) {
                    for(i in companias_cargadas.datos){
                        //imprimo las regiones por pantalla
                        console.log(companias_cargadas.datos[i].nombre);
                        companias[i] = companias_cargadas.datos[i];
                    }
                    //console.log(regiones.length);
                    agregarCompaniaAlCombo(companias);
                }       
            } else {
                console.log("ERROR!....");
            }
        } catch (error) {
            console.log(error);
        }
    }
}

//contactos



async function cargarContacto() {
    if(!token){
        localStorage.removeItem('token');
        location.href = "/";
    }else{
        try {
            let contactos = await fetch(`${SERVER_URL}/contactos/consultaContactos`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "access-token": `${token}`
                },
            });
            let contactos_cargados = await contactos.json();
            //console.log(cargarCompanias.status)
            if(contactos.status == 401){  //es pq no estoy logueado o JWT vencido
                localStorage.removeItem('token');
                location.href = "/";
            }else if(contactos.status == 200){
                if (contactos_cargados) {
                    let aux = []
                    for(i in contactos_cargados.datos){
                        //console.log("ACAAAAAAAAAAAAAAAAAAAAAAA");
                        console.log(contactos_cargados.datos[i].nombre);
                        aux[i] = contactos_cargados.datos[i];
                    }
                    console.log(aux.length);
                    agregarContactoAlCombo(aux);
                }       
            } else {
                console.log("ERROR!....");
            }
        } catch (error) {
            console.log(error);
        }
    }
}

function agregarContactoAlCombo(contactos){
    let str = "";
    console.log("TAM: "+contactos.length )
    for (let i=0; i<contactos.length; i++) {
        console.log(contactos[i].nombre )
        str += "<option value='" + contactos[i]._id + "'>" + contactos[i].nombre + "</option>"
    }

    document.getElementById("contactosM2").innerHTML = str;
    document.getElementById("contactosE3").innerHTML = str;
    
}


async function eliminarContacto(){
    var result = confirm("Want to delete?");
    if (result) {
        //Logic to delete the item
        let seleccionada = document.getElementById("contactosE3");
        seleccionada = seleccionada.options[seleccionada.selectedIndex].value;
        console.log('contacto seleccionada: ' + seleccionada);

        try {
            let eliminar = await fetch(`${SERVER_URL}/contactos/eliminarContacto/${seleccionada}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json', 
                    "access-token": `${token}`
                },
                //body: JSON.stringify(region)
            });
            let eliminada = await eliminar.json();
            if(eliminada.status == 401){  //es pq no estoy logueado o JWT vencido
                console.log("Error 401 eliminando contacto...")
            }else if(eliminada.status == 200){
                console.log("Se elimino OK!!")
            } else {
                console.log("ERROR....");
            }
        } catch (error) {
            console.log(error);
        }
    }
    
}

async function cargarRegiones(){ 
    if(!token){
        localStorage.removeItem('token');
        location.href = "/";
    }else{
        try {
            let cargarRegion = await fetch(`${SERVER_URL}/regiones/consultaRegiones`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json', 
                    "access-token": `${token}`
                },
                //body: JSON.stringify()
            });
            let region_cargada = await cargarRegion.json();
            if(cargarRegion.status == 401){  //es pq no estoy logueado o JWT vencido
                localStorage.removeItem('token');
                location.href = "/";
            }else if(cargarRegion.status == 200){
                if (region_cargada) {
                    
                    for(i in region_cargada.datos){
                        //imprimo las regiones por pantalla
                        console.log(region_cargada.datos[i].nombre);
                        regiones[i] = region_cargada.datos[i];
                    }
                    //console.log(regiones.length);
                    agregarRegionAlCombo(regiones);
                }
            } else {
                console.log("ERROR....");
            }
        } catch (error) {
            console.log(error);
        }
    }
}

//cargo regiones al inicio
cargarRegiones();

function agregarRegionAlCombo(regiones){
    let str = "";
    for (let i=0; i<regiones.length; i++) {
        str += "<option value='" + regiones[i]._id + "'>" + regiones[i].nombre + "</option>"
    }
    document.getElementById("regiones1").innerHTML = str;
    document.getElementById("regiones2").innerHTML = str;
    //document.getElementById("regiones3").innerHTML = str;
    agregarPaisesAlCombo(regiones[0]._id,1)
    agregarPaisesAlCombo(regiones[0]._id,2)
    //agregarPaisesAlCombo(regiones[0]._id,3)
}

async function agregarPaisesAlCombo(id_region, donde){
    let str = "";
    let paises;
    for (let i=0; i<regiones.length; i++) {
        if(regiones[i]._id == id_region){
            paises = regiones[i].paises;
            for (let j=0; j<regiones[i].paises.length; j++) {
                str += "<option value='" + regiones[i].paises[j]._id + "'>" + regiones[i].paises[j].nombre + "</option>"
              }
              if(donde == 1) {
                  document.getElementById("paises1").innerHTML = str;
                  if(paises.length) agregarCiudadesAlCombo(id_region, paises[0]._id, 1)
              }else if(donde == 2) {
                  document.getElementById("paises2").innerHTML = str;
                  if(paises.length) agregarCiudadesAlCombo(id_region, paises[0]._id, 2)
              }else if(donde == 3) {
                  //document.getElementById("paises3").innerHTML = str;
                  //if(paises.length) agregarCiudadesAlCombo(id_region, paises[0]._id, 3)
              }

              
              else {
                str += "<option value='" +  + "'>" +  + "</option>";
                if(donde == 1) document.getElementById("ciudades1").innerHTML = str;
                else if(donde == 2) document.getElementById("ciudades2").innerHTML = str;
                //else if(donde == 3) document.getElementById("ciudades3").innerHTML = str;
                
                
                
              }
        }
    }
}

async function agregarCiudadesAlCombo(id_region, id_pais, donde){
    let str = "";
    for (let i=0; i<regiones.length; i++) {
        if(regiones[i]._id == id_region){
            console.log(regiones[i].nombre)
            for (let j=0; j<regiones[i].paises.length; j++) {
                if(regiones[i].paises[j]._id == id_pais){
                    console.log(regiones[i].paises[j].nombre)
                    console.log(regiones[i].paises[j].ciudades.length)
                    for(let p=0; p<regiones[i].paises[j].ciudades.length; p++){
                        console.log("HOLA")
                        console.log(regiones[i].paises[j].ciudades[p].nombre)
                        str += "<option value='" + regiones[i].paises[j].ciudades[p]._id + "'>" + regiones[i].paises[j].ciudades[p].nombre + "</option>"
                    }
                    if(donde == 1) {
                        document.getElementById("ciudades1").innerHTML = str;
                    }else if(donde == 2) {
                        document.getElementById("ciudades2").innerHTML = str;
                    }else if(donde == 3) {
                        //document.getElementById("ciudades3").innerHTML = str;
                    }
                    
                    
                    
                }
            }
        }
    }
}

async function cambioRegion1() {
    selectedValue_regiones1 = selectBox_regiones1.options[selectBox_regiones1.selectedIndex].value;
    agregarPaisesAlCombo(selectedValue_regiones1,1)
}

async function cambioRegion2() {
    selectedValue_regiones2 = selectBox_regiones2.options[selectBox_regiones2.selectedIndex].value;
    agregarPaisesAlCombo(selectedValue_regiones2,2)
}

async function cambioPais2() {
    selectedValue_paises2 = selectBox_paises2.options[selectBox_paises2.selectedIndex].value;
    selectedValue_regiones2 = selectBox_regiones2.options[selectBox_regiones2.selectedIndex].value;
    agregarCiudadesAlCombo(selectedValue_regiones2, selectedValue_paises2, 2)
}

async function cambioPais1() {
    selectedValue_paises1 = selectBox_paises1.options[selectBox_paises1.selectedIndex].value;
    selectedValue_regiones1 = selectBox_regiones1.options[selectBox_regiones1.selectedIndex].value;
    agregarCiudadesAlCombo(selectedValue_regiones1, selectedValue_paises1, 1)
}

//varibles modificar contactos

const nombreInput2 = document.getElementById("nombre2");
const apellidoInput2 = document.getElementById("apellido2");
const cargoInput2 = document.getElementById("cargo2");
const emailInput2 = document.getElementById("email2");
const companiaInput2 = document.getElementById("compania3");

const regionInput2 = document.getElementById("regiones2");
const paisInput2 = document.getElementById("paises2");
const ciudadInput2 = document.getElementById("ciudades2");

const direccionInput2 = document.getElementById("direccion2");
const canalInput2 = document.getElementById("canal2");
const cuentaInput2 = document.getElementById("cuenta2");
const prefsInput2 = document.getElementById("preferencias2");



async function modificarContactos(){
    try {
        let contacto = {
            nombre: nombreInput2.value,
            apellido: apellidoInput2.value,
            cargo: cargoInput2.value,
            email: emailInput2.value
        }
        /*
        let contacto = {
            nombre: nombreInput2.value,
            apellido: apellidoInput2.value,
            cargo: cargoInput2.value,
            email: emailInput2.value,
            compania: companiaInput2.options[companiaInput2.selectedIndex].value,
            region: regionInput2.options[regionInput2.selectedIndex].value,
            pais: paisInput2.options[paisInput2.selectedIndex].value,
            ciudad: ciudadInput2.options[ciudadInput2.selectedIndex].value,
            direccion: direccionInput2.value,
            canalDeContacto: {
                canal: canalInput2.options[canalInput2.selectedIndex].value,
                cuentaDeUsuario: cuentaInput2.value,
                preferencias: prefsInput2.options[prefsInput2.selectedIndex].value
            }
            
        };
        */

        if( companiaInput2.options[companiaInput2.selectedIndex].value )  Object.assign(contacto, {compania: companiaInput2.options[companiaInput2.selectedIndex].value})
        //if( regionInput2.options[regionInput2.selectedIndex].value ) contacto.push({region: regionInput2.options[regionInput2.selectedIndex].value});
        //if( paisInput2.options[paisInput2.selectedIndex].value ) contacto.push({pais: paisInput2.options[paisInput2.selectedIndex].value});
        //if( ciudadInput2.options[ciudadInput2.selectedIndex].value ) contacto.push({ciudad: ciudadInput2.options[ciudadInput2.selectedIndex].value});
        //if( direccionInput2.value ) contacto.push({direccion: direccionInput2.value});
        //if( canalInput2.options[canalInput2.selectedIndex].value && cuentaInput2.value && prefsInput2.options[prefsInput2.selectedIndex].value ) contacto.push({canalDeContacto: { canal: canalInput2.options[canalInput2.selectedIndex].value, cuentaDeUsuario: cuentaInput2.value, preferencias: prefsInput2.options[prefsInput2.selectedIndex].value }});

        
        console.log(contacto);

        let seleccionada = document.getElementById("contactosM2");
        seleccionada = seleccionada.options[seleccionada.selectedIndex].value;
        console.log('contacto seleccionada: ' + seleccionada);
        
        let contactoMod = await fetch(`${SERVER_URL}/contactos/editarContacto/${seleccionada}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
                "access-token": `${token}`
            },
            body: JSON.stringify(contacto)
            
        });
    
        let contactoModificado = await contactoMod.json();
        if(contactoModificado.status == 401){  //es pq no estoy logueado o JWT vencido
            localStorage.removeItem('token');
            location.href = "/";
        }else if(contactoModificado.status == 200){
            console.log(contactoModificado);
        } else {
            console.log("ERROR....");
        }
        
        
    
    } catch (error) {
        //errorMessages.textContent = error;
        console.log(error);
        console.log("Error al modificar contacto");
    }


}


cargarRegiones();
cargarCompanias();
cargarContacto();