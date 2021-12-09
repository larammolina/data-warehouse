const inputRegion = document.getElementById('input_region');
const token = JSON.parse(localStorage.getItem('token'));
const profile = JSON.parse(localStorage.getItem('profile'));

const SERVER_URL = "http://localhost:3022"; 

var toggler = document.getElementsByClassName("caret");
var i;

consultarRegiones();

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

for (i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function () {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("caret-down");
    });
}



/*async function cargarRegiones() {
    try {
        let cargarRegion = await fetch(`${SERVER_URL}/regiones/consultaRegiones`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "access-token": `${token}`
            },
        });
        let region_cargada = await cargarRegion.json();

        if (region_cargada) {
            let regiones = [];
            let paises = [];
            for (i in region_cargada.datos) {
                //imprimo las regiones por pantalla
                console.log("Regiones: " + region_cargada.datos[i].nombre);
                for (j in region_cargada.datos[i].paises) {
                    console.log("   paises: " + region_cargada.datos[i].paises[j].nombre);
                    paises[i] = region_cargada.datos[i].paises[j];  //guardo el array completo, para despues sacar el nombre y el ID
                }
                regiones[i] = region_cargada.datos[i]; //guardo el array completo, para despues sacar el nombre y el ID
            }
            //console.log(regiones.length);
            addRegions(regiones, paises);

        } else {
            console.log("ERROR....");
        }
    } catch (error) {
        console.log(error);
        //alert(e);
    }
}*/

/*function addRegions(regiones, paises) {
    for (var i = 0; i < regiones.length; i++) {
        //AGREGO LA REGION
        var li_region = document.createElement('li');
        var span_region = document.createElement('span');

        console.log(" --> " + regiones[i].nombre + ' ID: ' + regiones[i]._id)
        //li_region.innerHTML = regiones[i].nombre;
        //li_region.className = 'caret';
        span_region.className = 'caret';
        span_region.innerHTML = regiones[i].nombre;
        li_region.id = regiones[i]._id;

        document.getElementById('myUL').appendChild(li_region);

        //POR CADA REGION, AGREGO LOS PAISES -- 
        var ul_paises = document.createElement('ul');
        ul_paises.id = "ulPaises" + i;
        ul_paises.className = "nested";
        document.getElementById(regiones[i]._id).appendChild(span_region);
        document.getElementById(regiones[i]._id).appendChild(ul_paises);

        for (var j = 0; j < regiones[i].paises.length; j++) {
            console.log('REGION: ' + regiones[i].nombre + " --- Pais: " + regiones[i].paises[j].nombre + ' ID: ' + regiones[i].paises[j]._id)

            var li_pais = document.createElement('li');
            var span_pais = document.createElement('span');


            span_pais.innerHTML = regiones[i].paises[j].nombre;
            span_pais.className = 'caret';
            //li_pais.innerHTML = regiones[i].paises[j].nombre;
            //li_pais.className = 'caret';
            li_pais.id = regiones[i].paises[j]._id;


            //document.getElementById('ulPaises').appendChild(li_pais);
            document.getElementById('ulPaises' + i).appendChild(li_pais);
            document.getElementById(regiones[i].paises[j]._id).appendChild(span_pais);
        }

    }
}*/

async function createRegion() {
    let nuevaRegion = input_region.value;
    if (nuevaRegion != '') {
        let region = {
            nombre: nuevaRegion
        };
        console.log(region);
        try {
            let crearRegion = await fetch(`${SERVER_URL}/regiones/agregarRegiones`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "access-token": `${token}`
                },
                body: JSON.stringify(region)
            });
            let region_creada = await crearRegion.json();

            if (region_creada.error) {
                console.log(region_creada);
                //treeAlert.style.display = 'unset';
                //treeAlertText.textContent = 'Invalid field!';
            } else {
                //getRegions();
            }
        } catch (error) {
            console.log(error);
            //alert(e);
        }
    } else {
        notification.innerHTML = "La region no debe estar vacia!"
    }
};

async function consultarRegiones() {
    try {
        let consultaRegion = await fetch(`${SERVER_URL}/regiones/consultaRegiones`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "access-token": `${token}`
            },
        });
        let region_cargada = await consultaRegion.json();

        if (region_cargada) {
            let regiones = [];
            let paises = [];
            for (i in region_cargada.datos) {
                //imprimo las regiones por pantalla
                console.log("Regiones: " + region_cargada.datos[i].nombre);
                for (j in region_cargada.datos[i].paises) {
                    console.log("   paises: " + region_cargada.datos[i].paises[j].nombre);
                    paises[i] = region_cargada.datos[i].paises[j];  //guardo el array completo, para despues sacar el nombre y el ID
                }
                regiones[i] = region_cargada.datos[i]; //guardo el array completo, para despues sacar el nombre y el ID
            }
            //console.log(regiones.length);
            mostrarRegion(regiones, paises);

        } else {
            console.log("ERROR....");
        }
    } catch (error) {
        console.log(error);
        //alert(e);
    }
}

async function mostrarRegion(regiones, paises) {
    for (var i = 0; i < regiones.length; i++) {
        //AGREGO LA REGION
        var li_region = document.createElement('li');
        var span_region = document.createElement('span');

        console.log(" --> " + regiones[i].nombre + ' ID: ' + regiones[i]._id)
        //li_region.innerHTML = regiones[i].nombre;
        //li_region.className = 'caret';
        span_region.className = 'resultadoRegion';
        span_region.innerHTML = regiones[i].nombre;
        li_region.id = regiones[i]._id;

        document.getElementById('resultadoRegion').appendChild(li_region);

        //POR CADA REGION, AGREGO LOS PAISES -- 
        var ul_paises = document.createElement('ul');
        ul_paises.id = "ulPaises" + i;
        ul_paises.className = "resul";
        document.getElementById(regiones[i]._id).appendChild(span_region);
        document.getElementById(regiones[i]._id).appendChild(ul_paises);

        for (var j = 0; j < regiones[i].paises.length; j++) {
            console.log('REGION: ' + regiones[i].nombre + " --- Pais: " + regiones[i].paises[j].nombre + ' ID: ' + regiones[i].paises[j]._id)

            var li_pais = document.createElement('li');
            var span_pais = document.createElement('span');


            span_pais.innerHTML = regiones[i].paises[j].nombre;
            span_pais.className = 'caret';
            //li_pais.innerHTML = regiones[i].paises[j].nombre;
            //li_pais.className = 'caret';
            li_pais.id = regiones[i].paises[j]._id;


            //document.getElementById('ulPaises').appendChild(li_pais);
            document.getElementById('ulPaises' + i).appendChild(li_pais);
            document.getElementById(regiones[i].paises[j]._id).appendChild(span_pais);
        }

    }
}