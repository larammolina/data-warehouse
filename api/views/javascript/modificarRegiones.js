const SERVER_URL = "http://localhost:3022";
const token = JSON.parse(localStorage.getItem('token'));
const profile = JSON.parse(localStorage.getItem('profile'));

let regiones = [];

let selectBox_regiones = document.getElementById("regiones");
let selectBox_paises = document.getElementById("paises");
let selectedValue_regiones, selectedValue_paises;

//cargo regiones al inicio
cargarRegiones();

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
                    agregarRegiones(regiones);
                }
            } else {
                console.log("ERROR....");
            }
        } catch (error) {
            console.log(error);
        }
    }
}

function agregarRegiones(regiones) {
    let str = "";
    for (let i=0; i<regiones.length; i++) {
      str += "<option value='" + regiones[i]._id + "'>" + regiones[i].nombre + "</option>"
    }
    document.getElementById("regiones").innerHTML = str;
    agregarPaises(regiones[0]._id)
}

async function agregarPaises(id_region){
    let str = "";
    let paises;
    for (let i=0; i<regiones.length; i++) {
        if(regiones[i]._id == id_region){
            paises = regiones[i].paises;
            for (let j=0; j<regiones[i].paises.length; j++) {
                str += "<option value='" + regiones[i].paises[j]._id + "'>" + regiones[i].paises[j].nombre + "</option>"
              }
              document.getElementById("paises").innerHTML = str;
              if(paises.length) agregarCiudades(id_region, paises[0]._id)
              else {
                str += "<option value='" +  + "'>" +  + "</option>";
                document.getElementById("ciudades").innerHTML = str;
              }
        }
    }
}

async function agregarCiudades(id_region, id_pais){
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
                    document.getElementById("ciudades").innerHTML = str;
                }
            }
        }
    }
}

async function cambioRegion() {
    selectedValue_regiones = selectBox_regiones.options[selectBox_regiones.selectedIndex].value;
    agregarPaises(selectedValue_regiones)
}

async function cambioPais() {
    selectedValue_paises = selectBox_paises.options[selectBox_paises.selectedIndex].value;
    agregarCiudades(selectedValue_regiones, selectedValue_paises)
}