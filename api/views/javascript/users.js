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

const APP_SERVER = "http://localhost:3022";

//listeners
// Create User listener
createBtn.addEventListener('click', createUser);

async function createUser(event) {
    event.preventDefault();

    try {
        let user = {
            name: userName.value,
            lastname: userLastname.value,
            email: userEmail.value,
            profile: userProfile.value,
            password: userPassword.value
        };
    
        let userCreate = await fetch(`${APP_SERVER}/user/signup`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "access-token": `${token}`
            },
            body: JSON.stringify(user)
        });
    
        let userCreated = await userCreate.json();
    
        if (userCreated) {
            addUserContainer.style.display = 'none';
            location.reload();
        }
    } catch (error) {
        errorMessages.textContent = error;
    }
};

 