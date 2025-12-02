const menu = document.getElementById("menu");
const formularioLogin = document.getElementById("formularioLogin");
const foro = document.getElementById("foro");
const enlaceCerrarSesion = document.getElementById("cerrarSesion");

const botonLogeo = document.getElementById("botonLogeo");

const usuarioLogin = document.getElementById("usuario");
const contrasenaLogin = document.getElementById("contrasena");

const listadoUsuarios = document.getElementById("listadoUsuarios");
const listadoMensajes = document.getElementById("listadoMensajes");
const registroMensajes = document.getElementById("registroMensajes");
const registroRespuestas = document.getElementById("registroRespuestas");

const botonMensaje = document.getElementById("botonMensaje");
const botonResponder = document.getElementById("botonResponder");
const mensaje = document.getElementById("mensaje");
const respuesta = document.getElementById("respuesta");
const encabezadoMensajes = document.getElementById("encabezadoMensajes");

document.addEventListener("DOMContentLoaded", mostrarLogin);
botonLogeo.addEventListener("click", logearUsuario);
enlaceCerrarSesion.addEventListener("click", mostrarLogin);
listadoUsuarios.addEventListener("click", mostrarMensajes);
listadoMensajes.addEventListener("click", mostrarRegistroRespuesta);

botonResponder.addEventListener("click", crearRespuesta);
botonMensaje.addEventListener("click", crearMensaje);

function limpiarTodo() {
    menu.style.display = "none";
    formularioLogin.style.display = "none";
    foro.style.display = "none";
}

function mostrarLogin() {
    limpiarTodo();
    formularioLogin.style.display = "block";
}

function mostrarForoYMenu() {
    limpiarTodo();
    foro.style.display = "block";
    menu.style.display = "block";
    registroMensajes.style.display = "none";
    registroRespuestas.style.display = "none";
    listadoMensajes.style.display = "none";
    encabezadoMensajes.innerHTML = "";
}

function limpiarInputsLog() {
    usuarioLogin.value = "";
    contrasenaLogin.value = "";
}


//He tenido un problema, no consigo capturar el error, y por tanto siempre entra aunque el usuario y contraseña sean incorrectos. No obstante
// en caso de que se introduzca de forma correcta, el funcionamiento en el foro es correcto, recordando su id y omitiéndolo en el listado de usuarios.
function logearUsuario() {

    if(usuarioLogin.value === "" || contrasenaLogin.value === "") {
        alert("No puede haber ningún campo vacío");
    } else {

        fetch("http://localhost:9999/buscarUsuarioPorLogin?nombreUsuario=" + usuarioLogin.value + "&pwdUsuario=" + contrasenaLogin.value, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        .then(respuesta => respuesta.json())
            
        .then(user => {
            mostrarForo(user.idUsuario);
        })

    }       
}


function mostrarForo(id) {

    limpiarInputsLog();
    mostrarForoYMenu();

    fetch("http://localhost:9999/buscarTodosLosUsuarios", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    .then(respuesta => respuesta.json())

    .then(usuarios => {
        let usuariosForo = usuarios.filter(u => u.idUsuario != id);

        listadoUsuarios.innerHTML = "";

        let tabla = document.createElement("table");
        tabla.className = "table table-hover";
        
        for(let u of usuariosForo) {
            let tbody = document.createElement("tbody");
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            td.textContent = u.nombreUsuario;
            td.setAttribute("data-id-usuario", u.idUsuario);
            td.setAttribute("data-nombre-usuario", u.nombreUsuario);
            tr.appendChild(td);
            tbody.appendChild(tr);
            tabla.appendChild(tbody);
        }

        listadoUsuarios.appendChild(tabla);
    })

}

let idUsuario;

function mostrarMensajes(e) {

    if(e.target.tagName != "TD") {
        return;
    }

    encabezadoMensajes.innerHTML = "Mensajes: " + e.target.dataset.nombreUsuario;

    listadoMensajes.innerHTML = "";

    listadoMensajes.style.display = "block";
    registroMensajes.style.display = "block";
    idUsuario = e.target.dataset.idUsuario;

    fetch("http://localhost:9999/buscarMensajePorId?idUsuario=" + idUsuario, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    .then(respuesta => respuesta.json())

    .then(respuesta => {
        let tabla = document.createElement("tabla");
        tabla.className = "table";

        for(let r of respuesta) {
            let tr = document.createElement("tr");
            let tbody = document.createElement("tbody");
            
            let td1 = document.createElement("td");
            td1.textContent = r.mensaje;
            tr.appendChild(td1);
            
            let td2 = document.createElement("td");
            let botonResponder = document.createElement("button");
            botonResponder.className = "btn btn-outline-primary";
            botonResponder.textContent = "Responder";
            botonResponder.setAttribute("data-id-mensaje", r.idMensaje);
            td2.appendChild(botonResponder);
            tr.appendChild(td2);
            
            let td3 = document.createElement("td");
            td3.textContent = "Respuestas:\n" + contarRespuestas(r.idMensaje); //Esto no funciona
            tr.appendChild(td3);

            tbody.appendChild(tr);
            tabla.appendChild(tbody);
        }

        listadoMensajes.appendChild(tabla);
    });
}

let idMensaje;

function mostrarRegistroRespuesta(e) {
    if(e.target.tagName != "BUTTON") {
        return;
    }
    registroRespuestas.style.display = "block";
    idMensaje = e.target.dataset.idMensaje;
}

function crearRespuesta() {

    if(respuesta.value === "") {
        alert("No se puede insertar una respuesta vacía");
        return;
    }

    let objetoRespuesta = {idMensaje: idMensaje, respuesta: respuesta.value};
    let jsonString = JSON.stringify(objetoRespuesta);

    fetch("http://localhost:9999/crearRespuesta", {
        method: "POST",
        body: jsonString,
        headers: {
            "Content-Type": "application/json"
        }
    })

    .then(response => response.text())

    .then(r => {
        if(r === "Ok") {
            alert("Respuesta creada correctamente");
            respuesta.value = "";
            mostrarForoYMenu();
        } else {
            alert("No se ha podido crear la respuesta");
        }
    })
}

//Este método no está funcionando, de ahí que en el listado de mensaje aparezca undefined en respuestas.
function contarRespuestas(id) {

    fetch("http://localhost:9999/buscarRespuestaPorId?idMensaje=" + id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    .then(respuesta => respuesta.json())

    .then(r => {
        numeroRespuestas = r.length;
        return numeroRespuestas;
    })

    
}


function crearMensaje() {

    if(mensaje.value === "") {
        alert("No se puede insertar un mensaje vacío");
        return;
    }

    let objetoMensaje = {idUsuario: idUsuario, mensaje: mensaje.value};
    let jsonString = JSON.stringify(objetoMensaje);

    fetch("http://localhost:9999/crearMensaje", {
        method: "POST",
        body: jsonString,
        headers: {
            "Content-Type": "application/json"
        }
    })

    .then(response => response.text())

    .then(r => {
        if(r === "Ok") {
            alert("Mensaje creado correctamente");
            mensaje.value = "";
            mostrarForoYMenu();
        } else {
            alert("El mensaje no ha podido crearse");
        }
    })
}