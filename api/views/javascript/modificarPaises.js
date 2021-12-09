const SERVER_URL = "http://localhost:3022";
const token = JSON.parse(localStorage.getItem('token'));
const profile = JSON.parse(localStorage.getItem('profile'));

let regiones = [];

let selectBox_regiones2 = document.getElementById("regiones2");
let selectBox_regiones3 = document.getElementById("regiones3");
let selectBox_paises = document.getElementById("paises");
let input_agregarPais = document.getElementById('paises1');
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
    console.log("Pais a agregar: " + input_agregarPais.value)
    let seleccionada = document.getElementById("regiones1");
    seleccionada = seleccionada.options[seleccionada.selectedIndex].value;
    try {
        let pais = {
            nombre: input_agregarPais.value,
        };
        console.log(pais);
        let pais_region = await fetch(`${SERVER_URL}/paises/agregarPais/${seleccionada}/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
                "access-token": `${token}`
            },
            body: JSON.stringify(pais)
        });
        let pais_agregada = await pais_region.json();
        if(pais_region.status == 401){  //es pq no estoy logueado o JWT vencido
            console.log("Error 401 agregando region..."+pais_region.status )
            alert("Error agregando el pais!")
        }else if(pais_region.status == 200){
            console.log("Se Agrego OK!!"+pais_region.status )
            alert("Se agrego el pais con exito!")
            location.href = "";
        } else {
            console.log("ERROR....");
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

    document.getElementById("paises2").innerHTML = ""
    document.getElementById("paises3").innerHTML = ""
    
    agregarPaises(regiones[0]._id,2)
    agregarPaises(regiones[0]._id,3)

}

async function agregarPaises(id_region, donde){
    let str = "";
    let paises;
    
    for (let i=0; i<regiones.length; i++) {
        //console.log(regiones[i]._id)
        //console.log(id_region)
        if(regiones[i]._id == id_region){
            console.log(id_region)
            paises = regiones[i].paises;
            for (let j=0; j<regiones[i].paises.length; j++) {
                
                str += "<option value='" + regiones[i].paises[j]._id + "'>" + regiones[i].paises[j].nombre + "</option>"
              }
              //if(donde == 1)    document.getElementById("paises1").innerHTML = str;
              if(donde == 2) document.getElementById("paises2").innerHTML = str;
              else if(donde == 3) document.getElementById("paises3").innerHTML = str;

              //if(paises.length) agregarCiudades(id_region, paises[0]._id)
              //else {
              //  str += "<option value='" +  + "'>" +  + "</option>";
              //  document.getElementById("ciudades").innerHTML = str;
             // }
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

async function cambioRegion2() {
    selectedValue_regiones2 = selectBox_regiones2.options[selectBox_regiones2.selectedIndex].value;
    agregarPaises(selectedValue_regiones2,2)
}

async function cambioRegion3() {
    selectedValue_regiones3 = selectBox_regiones3.options[selectBox_regiones3.selectedIndex].value;
    agregarPaises(selectedValue_regiones3,3)
}

async function cambioPais() {
    selectedValue_paises = selectBox_paises.options[selectBox_paises.selectedIndex].value;
    agregarCiudades(selectedValue_regiones, selectedValue_paises)
}

modificarBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    let seleccionada = document.getElementById("paises2");
    let nueva = document.getElementById('pais_nuevo').value;

    seleccionada = seleccionada.options[seleccionada.selectedIndex].value;

    console.log('Pais seleccionada:'+seleccionada);
    console.log('Pais nueva:'+nueva);
    //seleccionada = "1233"

    try {
        let pais = {
            nombre: nueva,
        };
        console.log(pais);
        let editar_pais = await fetch(`${SERVER_URL}/paises/editarPaises/${seleccionada}`, {
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
            alert("Error modificando el pais!")
        }else if(editar_pais.status == 200){
            console.log("Se Agrego OK!!"+editar_pais.status)
            alert("Se modifico el pais con exito!")
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
    let seleccionada = document.getElementById("paises3");
    seleccionada = seleccionada.options[seleccionada.selectedIndex].value;
    console.log('Pais seleccionada: ' + seleccionada);

    try {
        let eliminar_pais = await fetch(`${SERVER_URL}/paises/eliminarPaises/${seleccionada}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
                "access-token": `${token}`
            },
            //body: JSON.stringify(region)
        });
        let pais_eliminada = await eliminar_pais.json();
        if(eliminar_pais.status == 401){  //es pq no estoy logueado o JWT vencido
            console.log("Error 401 eliminando region..."+eliminar_pais.status)
            alert("Error eliminando el pais!")
        }else if(eliminar_pais.status == 200){
            console.log("Se elimino OK!!"+eliminar_pais.status)
            alert("Se elimino el pais con exito!")
            location.href = "";
        } else {
            console.log("ERROR...."+eliminar_pais.status);
            alert("Se produjo un Error!")
        }
    } catch (error) {
        console.log(error);
        alert("Se produjo un Error.")
    }

})