const inputRegion = document.getElementById('input_region');
const token = JSON.parse(localStorage.getItem('token'));
const profile = JSON.parse(localStorage.getItem('profile'));

const SERVER_URL = "http://localhost:3022";

var toggler = document.getElementsByClassName("caret");
var i;

for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function() {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("caret-down");
  });
}


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