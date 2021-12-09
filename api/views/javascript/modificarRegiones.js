const SERVER_URL = "http://localhost:3022";
const token = JSON.parse(localStorage.getItem('token'));
const profile = JSON.parse(localStorage.getItem('profile'));

let regiones = [];

let selectBox_regiones = document.getElementById("regiones");
let selectBox_paises = document.getElementById("paises");
let input_agregarRegion = document.getElementById('region1');
let selectedValue_regiones, selectedValue_paises;

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
    console.log("Region a agregar: " + input_agregarRegion.value)
    try {
        let region = {
            nombre: input_agregarRegion.value,
        };
        console.log(region);
        let agregar_region = await fetch(`${SERVER_URL}/regiones/agregarRegiones`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
                "access-token": `${token}`
            },
            body: JSON.stringify(region)
        });
        let region_agregada = await agregar_region.json();
        if(agregar_region.status == 401){  //es pq no estoy logueado o JWT vencido
            console.log("Error 401 agregando region..."+agregar_region.status)
            alert("Error agregando la region!")
        }else if(agregar_region.status == 200){
            console.log("Se Agrego OK!!"+agregar_region.status)
            alert("Se agrego la region con exito!")
            location.href = "";
        } else {
            console.log("ERROR...."+agregar_region.status);
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
    document.getElementById("regiones2").innerHTML = str;
    //agregarPaises(regiones[0]._id)
    document.getElementById("regiones3").innerHTML = str;

}

modificarBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    let seleccionada = document.getElementById("regiones2");
    let nueva = document.getElementById('regionNueva').value;

    seleccionada = seleccionada.options[seleccionada.selectedIndex].value;

    console.log('Region seleccionada:'+seleccionada);
    console.log('Region nueva:'+nueva);
    //seleccionada = "1233"

    try {
        let region = {
            nombre: nueva,
        };
        console.log(region);
        let editar_region = await fetch(`${SERVER_URL}/regiones/editarRegiones/${seleccionada}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
                "access-token": `${token}`
            },
            body: JSON.stringify(region)
        });
        let region_editada = await editar_region.json();
        if(editar_region.status == 401){  //es pq no estoy logueado o JWT vencido
            console.log("Error 401 agregando region..."+editar_region.status)
            alert("Error modificando la region!")
        }else if(editar_region.status == 200){
            console.log("Se Agrego OK!!"+editar_region.status)
            alert("Se modifico la region con exito!")
            location.href = "";
        } else {
            console.log("ERROR...."+editar_region.status);
            alert("Se produjo un Error!")
        }
    } catch (error) {
        console.log(error);
        alert("Se produjo un Error.")
    }

})

eliminarBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    let seleccionada = document.getElementById("regiones3");
    seleccionada = seleccionada.options[seleccionada.selectedIndex].value;
    console.log('Region seleccionada: ' + seleccionada);

    try {
        let eliminar_region = await fetch(`${SERVER_URL}/regiones/eliminarRegiones/${seleccionada}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
                "access-token": `${token}`
            },
            //body: JSON.stringify(region)
        });
        let region_eliminada = await eliminar_region.json();
        if(eliminar_region.status == 401){  //es pq no estoy logueado o JWT vencido
            console.log("Error 401 eliminando region..."+eliminar_region.status)
            alert("Error eliminando la region!")
        }else if(eliminar_region.status == 200){
            console.log("Se elimino OK!!"+eliminar_region.status)
            alert("Se elimino la region con exito!")
            location.href = "";
        } else {
            console.log("ERROR...."+eliminar_region.status);
            alert("Se produjo un Error!")
        }
    } catch (error) {
        console.log(error);
        alert("Se produjo un Error.")
    }

})
