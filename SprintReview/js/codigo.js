const formLogin = document.getElementById("formLoginUsuario");
const formGestion = document.getElementById("formUsuario");
const menu = document.getElementById("menu");
const botonRegistro = document.getElementById("btnRegistrarUsuario");
const botonLogin = document.getElementById("btnLoginUsuario");
const enlaceRegistrarse = document.getElementById("regUsuario");
const enlacePerfil = document.getElementById("perfil");
const enlaceCerrarSesion = document.getElementById("cerrarSesion");

//Cuidado con definir los inputs al principio. Siempre sin el value, si no los tomará como vacío.
const nombre = document.getElementById("nombre");
const apellidos = document.getElementById("apellidos");
const usuario = document.getElementById("usuario");
const contrasena = document.getElementById("contrasena");
const correo = document.getElementById("correo");

const usuarioLogin = document.getElementById("usuarioLogin");
const contrasenaLogin = document.getElementById("contrasenaLogin");

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

function limpiarInputsRegistro() {
    nombre.value = "";
    apellidos.value = "";
    usuario.value = "";
    contrasena.value = "";
    correo.value = "";
}

function limpiarInputsLog() {
    usuarioLogin.value = "";
    contrasenaLogin.value = "";
}

function logearUsuario() {

    if(usuarioLogin === "" || contrasenaLogin === "") {
        alert("No puede haber ningún campo vacío");
    } else {

        fetch("http://localhost:9999/buscarUsuarioPorLogin?usuario=" + usuarioLogin.value + "&contrasena=" + contrasenaLogin.value, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        .then(respuesta => respuesta.json())

        .then(r => {

            const user = r[0];
            
            if(!user) {
                alert("Usuario o contraseñas incorrecto");
            } else {
                id = user.id;
                nombre.value = user.nombre;
                apellidos.value = user.apellidos;
                usuario.value = user.usuario;
                contrasena.value = user.contrasena;
                correo.value = user.correo;

                mostrarPerfil();
            }

            limpiarInputsLog();

        })

    }       
}


function crearOActualizarUsuario() {
        
    if(nombre.value === "" || apellidos.value === "" || usuario.value === "" || contrasena.value === "" || correo.value === "") {
        alert("Hay campos vacíos, por favor rellénelos");
        return;
    }

    const miForm = new FormData(formGestion);
    const jsonData = Object.fromEntries(miForm);

    if(botonRegistro.value === "registrar") {

        const jsonString = JSON.stringify(jsonData);

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
            } else {
                alert("No ha podido registrarse el usuario correctamente");
            }
        })


    } else if(botonRegistro.value === "actualizar") {

        jsonData.id = id;
        const jsonString = JSON.stringify(jsonData);

        fetch("http://localhost:9999/actualizarUsuario", {
            method: "PUT",
            body: jsonString,
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

    limpiarInputsRegistro();
    mostrarLogin();

}