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

var i;

verificarProfile();

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
                        for (i in busqueda.resultado) {
                            console.log("Nombres: " + busqueda.resultado[i].nombre);
                            console.log("Apellido: " + busqueda.resultado[i].apellido);

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


                            resultado.appendChild(p_nombre);
                            resultado.appendChild(p_cargo);
                            resultado.appendChild(p_email);
                            resultado.appendChild(p_compania);
                            resultado.appendChild(p_region);
                            resultado.appendChild(p_pais);
                            resultado.appendChild(p_ciudad);
                            resultado.appendChild(p_interes);
                            resultado.appendChild(p_canalDeContacto);
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
                        for (i in busqueda.datos) {
                            console.log("Nombres: " + busqueda.datos[i].nombre);
                            console.log("Apellido: " + busqueda.datos[i].apellido);

                            
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
