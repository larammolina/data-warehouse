const token = JSON.parse(localStorage.getItem('token'));
const profile = JSON.parse(localStorage.getItem('profile'));

const SERVER_URL = "http://localhost:3022"; 

var i;

cargarCompanias();

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
                        console.log("Compania: " + companias_cargadas.datos[i].nombre + " " + companias_cargadas.datos[i].direccion + " " +companias_cargadas.datos[i].email + " " +companias_cargadas.datos[i].telefono + companias_cargadas.datos[i].ciudad);
                        
                        //let nodoNombre = document.createTextNode(companias_cargadas.datos[i].nombre);
                        //let nodoDireccion = document.createTextNode(companias_cargadas.datos[i].direccion);
                        //let nodoPais = document.createTextNode(companias_cargadas.datos[i].pais);
                        //resultado.appendChild(nodoNombre);
                        //resultado.appendChild(nodoDireccion);
                        //resultado.appendChild(nodoPais);
                        let resultado = document.getElementById("resultadoApi");
                        let p_nombre = document.createElement("P");
                        let p_direccion = document.createElement("P");
                        let p_pais = document.createElement("P");
                        let p_email= document.createElement("P");
                        let p_telefono = document.createElement("P");
                     
                     

                        p_nombre.innerHTML = companias_cargadas.datos[i].nombre;
                        if( companias_cargadas.datos[i].ciudades[0] ) p_pais.innerHTML = companias_cargadas.datos[i].ciudades[0].nombre;
                        else p_pais.innerHTML = ""
                        p_direccion.innerHTML = companias_cargadas.datos[i].direccion;
                        p_email.innerHTML = companias_cargadas.datos[i].email;
                        p_telefono.innerHTML = companias_cargadas.datos[i].telefono;
                        
                        
                        
                        resultado.appendChild(p_nombre);
                        resultado.appendChild(p_pais);
                        resultado.appendChild(p_direccion);
                        resultado.appendChild(p_email);
                        resultado.appendChild(p_telefono);
                        
                    }
                }       
            } else {
                console.log("ERROR!....");
            }
        } catch (error) {
            console.log(error);
        }
    }
}

async function modificarCompania(){
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
        if(region_editada.status == 401){  //es pq no estoy logueado o JWT vencido
            console.log("Error 401 agregando region...")
        }else if(region_editada.status == 200){
            console.log("Se Agrego OK!!")
        } else {
            console.log("ERROR....");
        }
    } catch (error) {
        console.log(error);
    }

}

async function eliminarCompania(){
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
        if(region_eliminada.status == 401){  //es pq no estoy logueado o JWT vencido
            console.log("Error 401 eliminando region...")
        }else if(region_eliminada.status == 200){
            console.log("Se elimino OK!!")
        } else {
            console.log("ERROR....");
        }
    } catch (error) {
        console.log(error);
    }

}