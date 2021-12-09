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
let selectBox_paises = document.getElementById("paises1");
let selectBox_paises2 = document.getElementById("paises2");
let selectedValue_regiones, selectedValue_paises, selectedValue_regiones1, selectedValue_regiones2, selectedValue_regiones3;

const SERVER_URL = "http://localhost:3022";
let contactosBuscados = []
var i;

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


async function buscarContacto() {
    if (!token) {
        localStorage.removeItem('token');
        location.href = "/";
    } else {
        let seleccionadaCampo = document.getElementById("campo");
        seleccionadaCampo = seleccionadaCampo.options[seleccionadaCampo.selectedIndex].value;

        let seleccionadaOrden = document.getElementById("orden");
        seleccionadaOrden = seleccionadaOrden.options[seleccionadaOrden.selectedIndex].value;

        let input_palabraABuscar = document.getElementById('valor');
        let valor = input_palabraABuscar.value;

        let orden;

        if (seleccionadaOrden == "Ascendente") {
            orden = 1;
        } else {
            orden = -1;
        }

        if (valor) {
            console.log("HAY VALOR")
            try {
                let buscarContactos = await fetch(`${SERVER_URL}/contactos/busqueda/${seleccionadaCampo}&${orden}&${valor}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        "access-token": `${token}`
                    },
                });
                let busqueda = await buscarContactos.json();
                //console.log(busqueda.resultado);


                if (buscarContactos.status == 401) {  //es pq no estoy logueado o JWT vencido
                    localStorage.removeItem('token');
                    location.href = "/";
                } else if (buscarContactos.status == 200) {
                    if (busqueda) {
                        contactosBuscados = busqueda.resultado
                        let resultado = document.getElementById("resultadoApi");
                        resultado.innerHTML = '';
                        for (i in busqueda.resultado) {
                            console.log("Nombres: " + busqueda.resultado[i].nombre);
                            console.log("Apellido: " + busqueda.resultado[i].apellido);
                            console.log("ID: "+contactosBuscados[i]._id)

                            let resultado = document.getElementById("resultadoApi");
                            let p_nombre = document.createElement("P");
                            let p_apellido = document.createElement("P");
                            let p_email = document.createElement("P");
                            let p_compania = document.createElement("P");
                            let p_cargo = document.createElement("P");
                            let p_region = document.createElement("P");
                            let p_pais = document.createElement("P");
                            let p_ciudad = document.createElement("P");
                            let p_direccion = document.createElement("P");
                            let p_interes = document.createElement("P");
                            let p_canalDeContacto = document.createElement("P");
                            let check = document.createElement("input");

                            check.setAttribute("id", busqueda.resultado[i]._id)
                            check.setAttribute("type", "checkbox")



                            p_nombre.innerHTML = busqueda.resultado[i].nombre;
                            p_apellido.innerHTML = busqueda.resultado[i].apellido;
                            p_cargo.innerHTML = busqueda.resultado[i].cargo;
                            p_email.innerHTML = busqueda.resultado[i].email;
                            if (busqueda.resultado[i].compania[0]) {
                                p_compania.innerHTML = busqueda.resultado[i].compania[0].nombre;
                            } else {
                                p_compania.innerHTML = "";
                            }

                            if (busqueda.resultado[i].region[0]) {
                                p_region.innerHTML = busqueda.resultado[i].region[0].nombre;
                            } else {
                                p_region.innerHTML = "";
                            }

                            if (busqueda.resultado[i].pais[0]) {
                                p_pais.innerHTML = busqueda.resultado[i].pais[0].nombre;
                            } else {
                                p_pais.innerHTML = "";
                            }

                            if (busqueda.resultado[i].ciudad[0]) {
                                p_ciudad.innerHTML = busqueda.resultado[i].ciudad[0].nombre;
                            } else {
                                p_ciudad.innerHTML = "";
                            }


                            p_direccion.innerHTML = busqueda.resultado[i].direccion;
                            p_interes.innerHTML = busqueda.resultado[i].interes;
                            p_canalDeContacto.innerHTML = busqueda.resultado[i].canalDeContacto;

                            resultado.appendChild(check)
                            resultado.appendChild(p_nombre);
                            resultado.appendChild(p_cargo);
                            resultado.appendChild(p_email);
                            resultado.appendChild(p_compania);
                            //resultado.appendChild(p_region);
                            //resultado.appendChild(p_pais);
                            resultado.appendChild(p_ciudad);
                            //resultado.appendChild(p_interes);
                            //resultado.appendChild(p_canalDeContacto);
                            
                        }
                    }
                } else {
                    console.log("ERROR....");
                }
            } catch (error) {
                console.log("ERROR LOGUEO...");
                console.log(error);
            }

        } else {
            console.log("NO HAY VALOR")

            try {
                let buscarContactos = await fetch(`${SERVER_URL}/contactos/consultaContactos/`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        "access-token": `${token}`
                    },
                });
                let busqueda = await buscarContactos.json();
                console.log(busqueda.datos);


                if (buscarContactos.status == 401) {  //es pq no estoy logueado o JWT vencido
                    localStorage.removeItem('token');
                    location.href = "/";
                } else if (buscarContactos.status == 200) {
                    if (busqueda) {
                        contactosBuscados = busqueda.datos
                        let resultado = document.getElementById("resultadoApi");
                        resultado.innerHTML = '';
                        for (i in busqueda.datos) {

                            console.log("Nombres: " + busqueda.datos[i].nombre);
                            console.log("Apellido: " + busqueda.datos[i].apellido);
                            console.log("ID: "+contactosBuscados[i]._id)

                            let resultado = document.getElementById("resultadoApi");
                            let p_nombre = document.createElement("P");
                            let p_apellido = document.createElement("P");
                            let p_email = document.createElement("P");
                            let p_compania = document.createElement("P");
                            let p_cargo = document.createElement("P");
                            let p_region = document.createElement("P");
                            let p_pais = document.createElement("P");
                            let p_ciudad = document.createElement("P");
                            let p_direccion = document.createElement("P");
                            let p_interes = document.createElement("P");
                            let p_canalDeContacto = document.createElement("P");
                            let check = document.createElement("input");

                            check.setAttribute("id", busqueda.datos[i]._id)
                            check.setAttribute("type", "checkbox")



                            p_nombre.innerHTML = busqueda.datos[i].nombre;
                            p_apellido.innerHTML = busqueda.datos[i].apellido;
                            p_cargo.innerHTML = busqueda.datos[i].cargo;
                            p_email.innerHTML = busqueda.datos[i].email;
                            if (busqueda.datos[i].compania[0]) {
                                p_compania.innerHTML = busqueda.datos[i].compania[0].nombre;
                            } else {
                                p_compania.innerHTML = "";
                            }

                            if (busqueda.datos[i].region[0]) {
                                p_region.innerHTML = busqueda.datos[i].region[0].nombre;
                            } else {
                                p_region.innerHTML = "";
                            }

                            if (busqueda.datos[i].pais[0]) {
                                p_pais.innerHTML = busqueda.datos[i].pais[0].nombre;
                            } else {
                                p_pais.innerHTML = "";
                            }

                            if (busqueda.datos[i].ciudad[0]) {
                                p_ciudad.innerHTML = busqueda.datos[i].ciudad[0].nombre;
                            } else {
                                p_ciudad.innerHTML = "";
                            }


                            p_direccion.innerHTML = busqueda.datos[i].direccion;
                            p_interes.innerHTML = busqueda.datos[i].interes;
                            p_canalDeContacto.innerHTML = busqueda.datos[i].canalDeContacto;

                            resultado.appendChild(check)
                            resultado.appendChild(p_nombre);
                            resultado.appendChild(p_cargo);
                            resultado.appendChild(p_email);
                            resultado.appendChild(p_compania);
                            //resultado.appendChild(p_region);
                            //resultado.appendChild(p_pais);
                            resultado.appendChild(p_ciudad);
                            //resultado.appendChild(p_interes);
                            //resultado.appendChild(p_canalDeContacto);
                            
                        }
                    }
                } else {
                    console.log("ERROR....");
                }
            } catch (error) {
                console.log("ERROR LOGUEO...");
                console.log(error);
            }





        }

    }

}

/* let botton = document.getElementById("ocultar"); botton.classList.remove("ocultar"); */ 


async function eliminarContacto(id){
    var result = confirm("Want to delete?");
    if (result) {

        try {
            let eliminar = await fetch(`${SERVER_URL}/contactos/eliminarContacto/${id}`, {
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

function prenderBoton () {
    let botton = document.getElementById("ocultar"); 
    botton.classList.remove("ocultar");
}


function detectarCheckboxs(){
    let aux = false;
    for(i in contactosBuscados){
        console.log("Busqueda: "+contactosBuscados[i]._id)
        if(document.getElementById(contactosBuscados[i]._id).checked){
            console.log("Checkeados: "+ contactosBuscados[i].nombre )
            eliminarContacto(contactosBuscados[i]._id);
            console.log("eliminando");
            aux= true;
        }
    }
    
    if(aux){
        location.href="";
    }
}



function eliminarContactoMasivo () {
    detectarCheckboxs()


}

//cargarContactos();

/*const createBtn = document.getElementById("btn-crear");
createBtn.addEventListener('click', cargarContactos);

async function cargarContactos() {
    if(!token){
        localStorage.removeItem('token');
        location.href = "/";
    }else{
        try {
            let cargarContactos = await fetch(`${SERVER_URL}/contactos/consultaContactos`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "access-token": `${token}`
                },
            });
            let contactos_cargados = await cargarContactos.json();
            if(cargarContactos.status == 401){  //es pq no estoy logueado o JWT vencido
                localStorage.removeItem('token');
                location.href = "/";
            }else if(cargarContactos.status == 200){
                if (contactos_cargados) {
                    for(i in contactos_cargados.datos){
                        console.log("Contacto: " + contactos_cargados.datos[i].nombre);
                    }
                }
            }else {
                console.log("ERROR....");
            }
        } catch (error) {
            console.log("ERROR LOGUEO...");
            console.log(error);
        }
    }
}*/
