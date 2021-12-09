const usernameInput = document.getElementById("usuario");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("btn-ingresar");
let loginHeaders = new Headers();
loginHeaders.append("Content-Type", "application/x-www-form-urlencoded");

const APP_SERVER = "http://localhost:3022";

loginBtn.addEventListener("click", (event) => {
    event.preventDefault();

    let loginUrl = APP_SERVER + '/user/login';
    let bodyEncoded = new URLSearchParams();

    bodyEncoded.append("username", usernameInput.value);
    bodyEncoded.append("password", passwordInput.value);

    let requestBody = {
        method: 'POST',
        headers: loginHeaders,
        body: bodyEncoded,
    };

    fetch(loginUrl, requestBody)
        .then(response => {
            if (response.status == 200) {
                response.json().then((result) => {
                    let token = result.token;
                    let profile = result.perf;

                    if (token !== undefined) {
                        console.log(" Token: " + token);
                        sessionStorage.setItem("token", JSON.stringify(token));
                        localStorage.setItem("token", JSON.stringify(token));
                        sessionStorage.setItem("profile", JSON.stringify(profile));
                        localStorage.setItem("profile", JSON.stringify(profile));
                        location.href = "users.html";
                    } else {
                        //notification.innerHTML = "Email or password is not valid!";
                        alert("Usuario o contraseña incorrecta...")
                        usernameInput.value = '';
                        passwordInput.value = '';
                    }
                });
            } else {
                //notification.innerHTML = "Email or password is not valid!";
                console.log("Error: " + response.json());
                alert("Usuario o contraseña incorrecta...")
                usernameInput.value = '';
                passwordInput.value = '';
            }
        });
});
 