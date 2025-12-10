 const botonCrear = document.getElementById("botonCrear");
 const botonEditar = document.getElementById("botonEditar");
 const mosaico = document.getElementById("mosaico");
 const inputNota = document.getElementById("notaACrear");
 let keys;
 let ultimaKey = 1;

 botonCrear.addEventListener("click", crearNota);
 document.addEventListener("DOMContentLoaded", mostrarNotas);
 mosaico.addEventListener("click", gestionarNota);

 function crearNota() {
    let nota = inputNota.value;
    localStorage.setItem(ultimaKey, nota);
    inputNota.value = "";
    mostrarNotas();
 }

 function mostrarNotas() {
    keys = JSON.parse(localStorage.getItem("key"));
    for(let key of keys) {
        let div = document.createElement("div");
        let p = document.createElement("p");
        p.textContent = localStorage.key(key);
        div.appendChild(p);
        let botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.setAttribute("id", "btnEditar");
        botonEditar.setAttribute("data-key", key);
        div.appendChild(botonEditar);
        let botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.setAttribute("id", "btnEliminar")
        botonEliminar.setAttribute("data-key", key);
        div.appendChild(botonEliminar);
        mosaico.appendChild(div);
        ultimaKey = String(Number(key) + 1);
    }
    console.log(ultimaKey);
 }

function gestionarNota(e) {
    if(e.target.id = "btnEditar") {

        let key = e.target.dataset.key;
        inputNota.value = localStorage.getItem(key);
        botonEditar.style.display = "block";
        botonCrear.style.display = "none";
        botonEditar.setAttribute("data-key", key);

    } else if(e.target.id = "btnEliminar") {

        let key = e.target.dataset.key;
        localStorage.removeItem(key);
        mostrarNotas();

    }
}

function editarNota() {
    localStorage.setItem(botonEditar.dataset.key, inputNota.value);
    inputNota.value = "";
    botonEditar.style.display = "none";
    botonCrear.style.display = "block";
}