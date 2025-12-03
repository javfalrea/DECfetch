const fecha = document.getElementById("fecha");
const email = document.getElementById("email");
const dni = document.getElementById("dni");
const contrasena = document.getElementById("contrasena");

const validarFecha = document.getElementById("validarFecha");
const validarEmail = document.getElementById("validarEmail");
const validarDNI = document.getElementById("validarDNI");
const validarContrasena = document.getElementById("validarContrasena");

validarFecha.addEventListener("click", validacionFecha);
validarEmail.addEventListener("click", validacionEmail);
validarDNI.addEventListener("click", validacionDNI);
validarContrasena.addEventListener("click", validacionContrasena);


function validacionFecha() {
    const regexp = /^[0-9]{2}-[0-9]{2}-[0-9]{4}$/;
    if(regexp.test(fecha.value)) {
        console.log("Válido");
        alert("Ok");
    } else {
        console.log("No válido");
        alert("No válido");
    }
}

function validacionEmail() {
    const regexp = /@.*\.com$/;
    if(regexp.test(email.value)) {
        console.log("Válido");
        alert("Ok");
    } else {
        console.log("No válido");
        alert("No válido");
    }
}

function validacionDNI() {
    const regexp = /^[0-9]{8}[A-Z]$/;
    if(regexp.test(dni.value)) {
        console.log("Válido");
        alert("Ok");
    } else {
        console.log("No válido");
        alert("No válido");
    }

}

function validacionContrasena() {
    const regexp = /[A-Za-z0-9\.]/;
    if(regexp.test(contrasena.value)) {
        console.log("Válido");
        alert("Ok");
    } else {
        console.log("No válido");
        alert("No válido");
    }
}