const token = JSON.parse(localStorage.getItem('token'));
const profile = JSON.parse(localStorage.getItem('profile'));

const SERVER_URL = "http://localhost:3022"; 

//var toggler = document.getElementsByClassName("caret");
var i;
/*
for (i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function () {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("caret-down");
    });
}*/

cargarContactos();

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
            }else if(cargarContactos.status == 201){
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
}