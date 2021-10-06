const usuarioInput = document.getElementById("usuario");
const nombreInput = document.getElementById("nombre");
const apellidoInput = document.getElementById("apellido");
const emailInput = document.getElementById("email");
const perfilInput = document.getElementById("perfil");
const passwordInput = document.getElementById("password");
const password2Input = document.getElementById("password2");
const createBtn = document.getElementById("btn-crear");

const token = JSON.parse(localStorage.getItem('token'));
const profile = JSON.parse(localStorage.getItem('profile'));

let loginHeaders = new Headers();
loginHeaders.append("Content-Type", "application/x-www-form-urlencoded");

const SERVER_URL = "http://localhost:3022";

//listeners
// Create User listener
createBtn.addEventListener('click', createUser);

async function createUser(event) {
    event.preventDefault();
    
    try {
        let user = {
            username: usuarioInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            nombre: nombreInput.value,
            apellido: apellidoInput.value
            
            //perfil: perfilInput.value,
            
        };
        console.log(user);
        
        let userCreate = await fetch(`${SERVER_URL}/user/signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
                "access-token": `${token}`
            },
            body: JSON.stringify(user)
            
        });
    
        let userCreated = await userCreate.json();
        
        console.log(userCreated);
        if (userCreated) {
            addUserContainer.style.display = 'none';
            location.reload();
        }
    } catch (error) {
        //errorMessages.textContent = error;
        console.log(error);
        console.log("Error al dar de alta el usuario");
    }
};

 