const tabla = document.getElementById("tabla");
const divMensajes = document.getElementById("divMensajes");
const letraMensajes = document.getElementById("usuarioMensajes");
const enlaceModoOscuro = document.getElementById("opcionOscuro");
const enlaceModoClaro = document.getElementById("opcionClaro");

enlaceModoClaro.addEventListener("click", modoClaro);
enlaceModoOscuro.addEventListener("click", modoOscuro);
document.addEventListener("DOMContentLoaded", inicializarModo);

function inicializarModo() {
    if(localStorage.getItem("modo") == "oscuro") {
        modoOscuro();
    } else {
        modoClaro();
    }
}

function modoClaro() {
    divMensajes.style.backgroundColor = "white";
    letraMensajes.style.color = "black";
    tabla.className = "table table-hover";
    localStorage.setItem("modo", "claro");
}

function modoOscuro() {
    divMensajes.style.backgroundColor = "#212529";
    letraMensajes.style.color = "white";
    tabla.className = "table table-hover table-dark";
    localStorage.setItem("modo", "oscuro");
}
