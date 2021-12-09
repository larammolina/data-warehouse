const SERVER_URL = "http://localhost:3022";
const token = JSON.parse(localStorage.getItem('token'));
const profile = JSON.parse(localStorage.getItem('profile'));

let regiones = [];

let selectBox_regiones1 = document.getElementById("regiones1");
let selectBox_regiones2 = document.getElementById("regiones2");
let selectBox_regiones3 = document.getElementById("regiones3");
let selectBox_paises  = document.getElementById("paises");
let selectBox_paises2 = document.getElementById("paises2");
let selectBox_paises3 = document.getElementById("paises3");
let input_agregarPais = document.getElementById('ciudades1');
let selectedValue_regiones, selectedValue_paises, selectedValue_regiones1, selectedValue_regiones2, selectedValue_regiones3;

const agregarBtn = document.getElementById("btn-agregar");
const modificarBtn = document.getElementById("btn-modificar");
const eliminarBtn = document.getElementById("btn-elimininar");

verificarProfile();

async function verificarProfile(){
    if(!token){
        localStorage.removeItem('token');
        location.href = "/";
    }else{
        if(profile == "admin"){
            console.log("Soy admin")
        }else{
            var element = document.getElementById("usuariosMenu");
            element.classList.add("ocultar");
            var element2 = document.getElementById("usuariosMenuFooter");
            element2.classList.add("ocultar");
        }
    }
}

agregarBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    console.log("Ciudad a agregar: " + input_agregarPais.value)
    let seleccionada = document.getElementById("paises1");
    seleccionada = seleccionada.options[seleccionada.selectedIndex].value;
    try {
        let ciudad = {
            nombre: input_agregarPais.value
        };
        console.log(ciudad);
        let agregar_ciudad = await fetch(`${SERVER_URL}/ciudades/agregarCiudad/${seleccionada}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
                "access-token": `${token}`
            },
            body: JSON.stringify(ciudad)
        });
        let ciudad_agregada = await agregar_ciudad.json();
        if(agregar_ciudad.status == 401){  //es pq no estoy logueado o JWT vencido
            console.log("Error 401 agregando region..."+agregar_ciudad.status)
            alert("Error agregando la ciudad!")
        }else if(agregar_ciudad.status == 200){
            console.log("Se Agrego OK!!"+agregar_ciudad.status)
            alert("Se agrego la ciudad con exito!")
            location.href = "";
        } else {
            console.log("ERROR...."+agregar_ciudad.status);
            alert("Se produjo un Error!")
        }
    } catch (error) {
        console.log(error);
        alert("Se produjo un Error.")
    }
})

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
    document.getElementById("regiones3").innerHTML = str;
    document.getElementById("paises1").innerHTML = ""
    document.getElementById("paises2").innerHTML = ""
    document.getElementById("paises3").innerHTML = ""
    document.getElementById("ciudades1").innerHTML = ""
    document.getElementById("ciudades2").innerHTML = ""
    document.getElementById("ciudades3").innerHTML = ""
    agregarPaisesAlCombo(regiones[0]._id,1)
    agregarPaisesAlCombo(regiones[0]._id,2)
    agregarPaisesAlCombo(regiones[0]._id,3)
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
                  document.getElementById("ciudades1").innerHTML = ""
                  if(paises.length) agregarCiudadesAlCombo(id_region, paises[0]._id, 1)
              }else if(donde == 2) {
                  document.getElementById("paises2").innerHTML = str;
                  document.getElementById("ciudades2").innerHTML = ""
                  if(paises.length) agregarCiudadesAlCombo(id_region, paises[0]._id, 2)
              }else if(donde == 3) {
                  document.getElementById("paises3").innerHTML = str;
                  document.getElementById("ciudades3").innerHTML = ""
                  if(paises.length) agregarCiudadesAlCombo(id_region, paises[0]._id, 3)
              }

              
              else {
                str += "<option value='" +  + "'>" +  + "</option>";
                if(donde == 1) document.getElementById("ciudades1").innerHTML = str;
                else if(donde == 2) document.getElementById("ciudades2").innerHTML = str;
                else if(donde == 3) document.getElementById("ciudades3").innerHTML = str;
                
                
                
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
                        document.getElementById("ciudades3").innerHTML = str;
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

async function cambioRegion3() {
    selectedValue_regiones3 = selectBox_regiones3.options[selectBox_regiones3.selectedIndex].value;
    agregarPaisesAlCombo(selectedValue_regiones3,3)
}

async function cambioPais2() {
    selectedValue_paises2 = selectBox_paises2.options[selectBox_paises2.selectedIndex].value;
    selectedValue_regiones2 = selectBox_regiones2.options[selectBox_regiones2.selectedIndex].value;
    agregarCiudadesAlCombo(selectedValue_regiones2, selectedValue_paises2, 2)
}

async function cambioPais3() {
    selectedValue_paises3 = selectBox_paises3.options[selectBox_paises3.selectedIndex].value;
    selectedValue_regiones3 = selectBox_regiones3.options[selectBox_regiones3.selectedIndex].value;
    agregarCiudadesAlCombo(selectedValue_regiones3, selectedValue_paises3, 3)
}

modificarBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    let seleccionada = document.getElementById("ciudades2");
    seleccionada = seleccionada.options[seleccionada.selectedIndex].value;
    console.log('Ciudad seleccionada: ' + seleccionada);
    let nueva = document.getElementById('ciudad_nuevo').value;

    console.log('Pais seleccionada:'+seleccionada);
    console.log('Pais nueva:'+nueva);
    try {
        let pais = {
            nombre: nueva,
        };
        console.log(pais);
        let editar_pais = await fetch(`${SERVER_URL}/ciudades/editarCiudades/${seleccionada}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
                "access-token": `${token}`
            },
            body: JSON.stringify(pais)
        });
        let pais_editada = await editar_pais.json();
        if(editar_pais.status == 401){  //es pq no estoy logueado o JWT vencido
            console.log("Error 401 agregando pais..."+editar_pais.status)
            alert("Error modificando la ciudad!")
        }else if(editar_pais.status == 200){
            console.log("Se Agrego OK!!"+editar_pais.status)
            alert("Se modifico la ciudad con exito!")
            location.href = "";
        } else {
            console.log("ERROR...."+editar_pais.status);
            alert("Se produjo un Error!")
        }
    } catch (error) {
        console.log(error);
        alert("Se produjo un Error.")
    }

})

eliminarBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    let seleccionada = document.getElementById("ciudades3");
    seleccionada = seleccionada.options[seleccionada.selectedIndex].value;
    console.log('Ciudad seleccionada: ' + seleccionada);

    try {
        let eliminar_ciudad = await fetch(`${SERVER_URL}/ciudades/eliminarCiudades/${seleccionada}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
                "access-token": `${token}`
            },
            //body: JSON.stringify(region)
        });
        let ciudad_eliminada = await eliminar_ciudad.json();
        if(eliminar_ciudad.status == 401){  //es pq no estoy logueado o JWT vencido
            console.log("Error 401 eliminando region..."+eliminar_ciudad.status)
            alert("Error eliminando la region!")
        }else if(eliminar_ciudad.status == 200){
            console.log("Se elimino OK!!"+eliminar_ciudad.status)
            alert("Se elimino la region con exito!")
            location.href = "";
        } else {
            console.log("ERROR...."+eliminar_ciudad.status);
            alert("Se produjo un Error!")
        }
    } catch (error) {
        console.log(error);
        alert("Se produjo un Error.")
    }

})
