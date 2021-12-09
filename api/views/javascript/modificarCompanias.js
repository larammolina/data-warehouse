const token = JSON.parse(localStorage.getItem('token'));
const profile = JSON.parse(localStorage.getItem('profile'));

const SERVER_URL = "http://localhost:3022"; 

var i;
let companias = [];
let regiones = [];
let input_agregarComp = document.getElementById('compania_agregar');
let input_agregarComp_email = document.getElementById('compania_agregar_email');
let input_agregarComp_telefono = document.getElementById('compania_agregar_telefono');
let input_agregarComp_direccion = document.getElementById('compania_agregar_direccion');

let selectBox_regiones1 = document.getElementById("regionesA");
let selectBox_paises  = document.getElementById("paisesA");
let selectedValue_regiones, selectedValue_paises, selectedValue_regiones1, selectedValue_regiones2, selectedValue_regiones3;

const agregarBtn = document.getElementById("btn_agregar");
const modificarBtn = document.getElementById("btn_modif");
const eliminarBtn = document.getElementById("btn_elimini");

cargarCompanias();

//cargo regiones al inicio
cargarRegiones();

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

function agregarCompaniaAlCombo(companias){
    let str = "";
    for (let i=0; i<companias.length; i++) {
        str += "<option value='" + companias[i]._id + "'>" + companias[i].nombre + "</option>"
    }
    document.getElementById("compania2").innerHTML = str;
    document.getElementById("compania3").innerHTML = str;

}

modificarBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    let seleccionada = document.getElementById("compania2");
    let nueva = document.getElementById('companiaNueva').value;

    seleccionada = seleccionada.options[seleccionada.selectedIndex].value;

    console.log('COmpania seleccionada:'+seleccionada);
    console.log('Companis nueva:'+nueva);
    //seleccionada = "1233"

    try {
        let compania = {
            nombre: nueva,
        };
        console.log(compania);
        let editar_compania = await fetch(`${SERVER_URL}/companias/editarCompania/${seleccionada}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
                "access-token": `${token}`
            },
            body: JSON.stringify(compania)
        });
        let compania_editada = await editar_compania.json();
        if(editar_compania.status == 401){  //es pq no estoy logueado o JWT vencido
            console.log("Error modificando la compania..."+editar_compania.status)
            alert("Error modificando la compania!")
        }else if(editar_compania.status == 200){
            console.log("Se modifico OK!!"+editar_compania.status)
            alert("Se modifico la compania con exito!")
            location.href = "";
        } else {
            console.log("ERROR...."+editar_compania.status);
            alert("Se produjo un Error!")
        }
    } catch (error) {
        console.log(error);
        alert("Se produjo un Error.")
    }

})

eliminarBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    let seleccionada = document.getElementById("compania3");
    seleccionada = seleccionada.options[seleccionada.selectedIndex].value;
    console.log('Compania seleccionada: ' + seleccionada);

    try {
        let eliminar_compania = await fetch(`${SERVER_URL}/companias/eliminarCompania/${seleccionada}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
                "access-token": `${token}`
            },
            //body: JSON.stringify(region)
        });
        let compania_eliminada = await eliminar_compania.json();
        if(eliminar_compania.status == 401){  //es pq no estoy logueado o JWT vencido
            console.log("Error 401 eliminando region..."+eliminar_compania.status)
            alert("Error eliminando la compania!")
        }else if(eliminar_compania.status == 200){
            console.log("Se elimino OK!!")+eliminar_compania.status
            alert("Se elimino la compania con exito!")
            location.href = "";
        } else {
            console.log("ERROR...."+eliminar_compania.status);
            alert("Se produjo un Error!")
        }
    } catch (error) {
        console.log(error);
        alert("Se produjo un Error.")
    }

})

agregarBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    console.log("Compania a agregar: " + input_agregarComp.value)
    
    let seleccionada = document.getElementById("ciudadesA");
    seleccionada = seleccionada.options[seleccionada.selectedIndex].value;
    console.log('Ciudad seleccionada: ' + seleccionada);
    //if(input_agregarRegion.value.isNaN == false){
        try {
            let compania = {
                nombre: input_agregarComp.value,
                direccion: input_agregarComp_direccion.value,
                email: input_agregarComp_email.value,
                telefono: input_agregarComp_telefono.value,
                ciudades: seleccionada
            };
            console.log(compania);
            let agregar_compania = await fetch(`${SERVER_URL}/companias/agregarCompanias`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json', 
                    "access-token": `${token}`
                },
                body: JSON.stringify(compania)
            });
            let compania_agregada = await agregar_compania.json();
            if(agregar_compania.status == 401){  //es pq no estoy logueado o JWT vencido
                console.log("Error 401 agregando region..." + agregar_compania.status)
                alert("Error agregando la compania!")
                //location.href = "";
            }else if(agregar_compania.status == 200){
                console.log("Se Agrego OK!!" + agregar_compania.status)
                alert("Se agrego la compania con exito!")
                location.href = "";
            } else {
                console.log("ERROR...."+ agregar_compania.status);
                alert("Se produjo un Error!" )
                //location.href = "";
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

function agregarRegionAlCombo(regiones){
    let str = "";
    for (let i=0; i<regiones.length; i++) {
        str += "<option value='" + regiones[i]._id + "'>" + regiones[i].nombre + "</option>"
    }
    document.getElementById("regionesA").innerHTML = str;
    document.getElementById("paisesA").innerHTML = ""
    document.getElementById("ciudadesA").innerHTML = ""
    agregarPaisesAlCombo(regiones[0]._id,1)
}

async function agregarPaisesAlCombo(id_region, donde){
    let str = "";
    document.getElementById("paisesA").innerHTML = ""
    document.getElementById("ciudadesA").innerHTML = ""
    let paises;
    for (let i=0; i<regiones.length; i++) {
        if(regiones[i]._id == id_region){
            paises = regiones[i].paises;
            for (let j=0; j<regiones[i].paises.length; j++) {
                str += "<option value='" + regiones[i].paises[j]._id + "'>" + regiones[i].paises[j].nombre + "</option>"
              }
              if(donde == 1) {
                  document.getElementById("paisesA").innerHTML = str;
                  if(paises.length) agregarCiudadesAlCombo(id_region, paises[0]._id, 1)
              }

              else {
                str += "<option value='" +  + "'>" +  + "</option>";
                if(donde == 1) document.getElementById("ciudadesA").innerHTML = str;             
                
                
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
                        document.getElementById("ciudadesA").innerHTML = str;
                    }
                                      
                    
                }
            }
        }
    }
}

async function cambioRegionA() {
    selectedValue_regiones1 = selectBox_regiones1.options[selectBox_regiones1.selectedIndex].value;
    agregarPaisesAlCombo(selectedValue_regiones1,1)
}

async function cambioPaisA() {
    selectedValue_paises1 = selectBox_paises1.options[selectBox_paises1.selectedIndex].value;
    selectedValue_regiones1 = selectBox_regiones1.options[selectBox_regiones1.selectedIndex].value;
    agregarCiudadesAlCombo(selectedValue_regiones1, selectedValue_paises1, 1)
}