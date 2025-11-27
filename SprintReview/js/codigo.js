const formLogin = document.getElementById("formLoginUsuario");
const formGestion = document.getElementById("formUsuario");
const menu = document.getElementById("menu");
const botonRegistro = document.getElementById("btnRegistrarUsuario");
const botonLogin = document.getElementById("btnLoginUsuario");
const enlaceRegistrarse = document.getElementById("regUsuario");
const enlacePerfil = document.getElementById("perfil");
const enlaceCerrarSesion = document.getElementById("cerrarSesion");

let nombre = document.getElementById("nombre").value;
let apellidos = document.getElementById("apellidos").value;
let usuario = document.getElementById("usuario").value;
let contrasena = document.getElementById("contrasena").value;
let correo = document.getElementById("correo").value;

let id = 0;

document.addEventListener("DOMContentLoaded", mostrarLogin);
enlaceRegistrarse.addEventListener("click", mostrarCreacion);
enlacePerfil.addEventListener("click", mostrarActualizacion);
enlaceCerrarSesion.addEventListener("click", mostrarLogin);
botonRegistro.addEventListener("click", crearOActualizarUsuario);
botonLogin.addEventListener("click", logearUsuario);

function limpiarTodo() {
    formLogin.style.display = "none";
    formGestion.style.display = "none";
    menu.style.display = "none";
    botonRegistro.value = "registrar";
    botonRegistro.textContent = "Registrar";
}

function mostrarLogin() {
    limpiarTodo();
    formLogin.style.display = "block";
}

function mostrarCreacion() {
    limpiarTodo();
    formGestion.style.display = "block";
}

function mostrarPerfil() {
    limpiarTodo();
    menu.style.display = "block";
}

function mostrarActualizacion() {
    limpiarTodo();
    menu.style.display = "block";
    formGestion.style.display = "block";
    botonRegistro.value = "actualizar";
    botonRegistro.textContent = "Actualizar";
}

//Entra con cualquier campo de busqueda no vacío. No pilla los campos de búsqueda bien creo.
function logearUsuario() {

    const usuarioLogin = document.getElementById("usuarioLogin").value;
    const contrasenaLogin = document.getElementById("contrasenaLogin").value;

    if(usuarioLogin === "" || contrasenaLogin === "") {
        alert("No puede haber ningún campo vacío");
    } else {

        //Aquí es donde parece estar el problema pero no sé solucionarlo.
        fetch("http://localhost:9999/buscarUsuarioPorLogin?usuario=" + usuarioLogin + "&contrasena=" + contrasenaLogin, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        .then(respuesta => respuesta.json())

        .then(r => {

            if (r == []) {
                alert("Usuario o contraseñas incorrecto");
            } else {
                id = r.id;
                nombre = r.nombre;
                apellidos = r.nombre;
                usuario = r.usuario;
                contrasena = r.contrasena;
                correo = r.correo;

                mostrarPerfil();
            }
        })

    }       
}


//Crea o actualiza el usuario según el value de nuestro botón de registro, que cambia según el formulario que se muestra.
function crearOActualizarUsuario() {

    let nombre = document.getElementById("nombre").value;
    let apellidos = document.getElementById("apellidos").value;
    let usuario = document.getElementById("usuario").value;
    let contrasena = document.getElementById("contrasena").value;
    let correo = document.getElementById("correo").value;
        
    if(nombre === "" || apellidos === "" || usuario === "" || contrasena === "" || correo === "") {
        alert("Hay campos vacíos, por favor rellénelos");
        return;
    }

    const miForm = new FormData(formGestion);
    const jsonData = Object.fromEntries(miForm);
    const jsonString = JSON.stringify(jsonData);

    if(botonRegistro.value === "registrar") {

        fetch("http://localhost:9999/crearUsuario", {
            method: "POST",
            body: jsonString,
            headers: {
                "Content-Type": "application/json"
            }
        })

        .then(respuesta => respuesta.text())

        .then(r => {
            if(r === "Ok") {
                alert("Usuario registrado correctamente");
                limpiarFormularioRegistro();
                mostrarLogin();
            } else {
                alert("No ha podido registrarse el usuario correctamente");
            }
        })

    } else if(botonRegistro.value === "actualizar") {

        //No sé si es correcto pero como el logueo no me lo está haciendo bien, no me devuelve el id bien.
        fetch("http://localhost:9999/actualizarUsuario", {
            method: "PUT",
            body: jsonString, id,
            headers: {
                "Content-Type": "application/json"
            }
        })

        .then(respuesta => respuesta.text())

        .then(r => {
            if(r === "Ok") {
                alert("Usuario actualizado correctamente");
            } else {
                alert("No ha podido actualizarse el usuario correctamente");
            }
        })

    }

    
    

}