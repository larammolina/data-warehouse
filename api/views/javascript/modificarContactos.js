const token = JSON.parse(localStorage.getItem('token'));
const profile = JSON.parse(localStorage.getItem('profile'));

const nombreInput = document.getElementById("nombre");
const apellidoInput = document.getElementById("apellido");
const cargoInput = document.getElementById("cargo");
const emailInput = document.getElementById("email");
const companiaInput = document.getElementById("compania");
const direccionInput = document.getElementById("direccion");
const cuentaInput = document.getElementById("cuenta");

let selectBox_regiones1 = document.getElementById("regiones1");
let selectBox_regiones2 = document.getElementById("regiones2");
let selectBox_paises  = document.getElementById("paises1");
let selectBox_paises2 = document.getElementById("paises2");
let selectedValue_regiones, selectedValue_paises, selectedValue_regiones1, selectedValue_regiones2, selectedValue_regiones3;


const SERVER_URL = "http://localhost:3022";
let regiones = []
// Create contact listener
createBtn.addEventListener('click', crearContacto);


cargarRegiones()

async function crearContacto(){
    try {
        let contacto = {
            nombre: nombreInput.value,
            apellido: apellidoInput.value,
            cargo: cargoInput.value,
            email: emailInput.value,
            compania: companiaInput.value,
            region: regionInput.value,
            pais: paisInput.value,
            ciudad: ciudadInput,
            direccion: direccionInput,
            interes: interesInput,

            canalDeContacto: canalDeContactoInput.value,
            cuentaDeUsuario: cuentaDeUsuarioInput.value,
            preferencias: preferenciasInput.value
            
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

async function eliminarContacto(){

    let seleccionada = document.getElementById("contactos3");
    seleccionada = seleccionada.options[seleccionada.selectedIndex].value;
    console.log('contacto seleccionada: ' + seleccionada);

    try {
        let eliminar = await fetch(`${SERVER_URL}/regiones/eliminarContacto/${seleccionada}`, {
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
        }else if(eliminada.status == 201){
            console.log("Se elimino OK!!")
        } else {
            console.log("ERROR....");
        }
    } catch (error) {
        console.log(error);
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
            }else if(cargarRegion.status == 201){
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

async function modificarContactos(){
    try {
        let contacto = {
            nombre: nombreInput.value,
            apellido: apellidoInput.value,
            cargo: cargoInput.value,
            email: emailInput.value,
            compania: companiaInput.value,
            region: regionInput.value,
            pais: paisInput.value,
            ciudad: ciudadInput,
            direccion: direccionInput,
            interes: interesInput,

            canalDeContacto: canalDeContactoInput.value,
            cuentaDeUsuario: cuentaDeUsuarioInput.value,
            preferencias: preferenciasInput.value
            
        };
        console.log(contacto);

        let seleccionada = document.getElementById("contactos2");
        seleccionada = seleccionada.options[seleccionada.selectedIndex].value;
        console.log('contacto seleccionada: ' + seleccionada);
        
        let contactoMod = await fetch(`${SERVER_URL}/contactos/modificarContacto/${seleccionada}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
                "access-token": `${token}`
            },
            body: JSON.stringify(contacto)
            
        });
    
        let contactoModificado = await contactoMod.json();
        
        console.log(contactoModificado);
    
    } catch (error) {
        //errorMessages.textContent = error;
        console.log(error);
        console.log("Error al modificar contacto");
    }


}