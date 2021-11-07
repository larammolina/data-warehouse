const token = JSON.parse(localStorage.getItem('token'));
const profile = JSON.parse(localStorage.getItem('profile'));

const SERVER_URL = "http://localhost:3022"; 

var i;

cargarCompanias();

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
            }else if(cargarCompanias.status == 201){
                if (companias_cargadas) {
                    for(i in companias_cargadas.datos){
                        console.log("Compania: " + companias_cargadas.datos[i].nombre);
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