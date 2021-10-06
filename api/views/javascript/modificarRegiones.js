const SERVER_URL = "http://localhost:3022";
const token = JSON.parse(localStorage.getItem('token'));
const profile = JSON.parse(localStorage.getItem('profile'));


//cargo regiones al inicio
cargarRegiones();

async function cargarRegiones(){
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

        if (region_cargada) {
            let regiones = [];
            for(i in region_cargada.datos){
                //imprimo las regiones por pantalla
                console.log(region_cargada.datos[i].nombre);
                regiones[i] = region_cargada.datos[i].nombre;
            }
            //console.log(regiones.length);
            addRegions(regiones);
            
        } else {
            console.log("ERROR....");
        }
    } catch (error) {
        console.log(error);
        //alert(e);
    }
}

function addRegions(regiones) {
    //var x = document.getElementById("regiones").value;
    var str = "";
    //console.log(regiones.length);
    for (let i=0; i<regiones.length; i++) {
      str += "<option>" + regiones[i] + "</option>"
    }
    document.getElementById("regiones").innerHTML = str;
  }

async function cargarPaises(){

}

async function agregarCiudad(){

}