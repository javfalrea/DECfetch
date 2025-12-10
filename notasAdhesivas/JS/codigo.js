 const botonCrear = document.getElementById("botonCrear");
 const botonEditar = document.getElementById("botonEditar");
 const mosaico = document.getElementById("mosaico");
 const inputNota = document.getElementById("notaACrear");
 let keys = [];
 let ultimaKey = localStorage.setItem("ultimaKey", 1);

 botonCrear.addEventListener("click", crearNota);
 document.addEventListener("DOMContentLoaded", mostrarNotas);
 mosaico.addEventListener("click", gestionarNota);
 botonEditar.addEventListener("click", editarNota);

 function crearNota() {
    if(inputNota.value == "") {
        alert("La nota no puede estar vacía");
        return;
    }
    let nota = inputNota.value;
    localStorage.setItem(String(localStorage.getItem("ultimaKey")), nota);
    inputNota.value = "";
    keys.push(localStorage.getItem("ultimaKey"));
    localStorage.setItem("key", JSON.stringify(keys));
    localStorage.setItem("ultimaKey", Number(localStorage.getItem("ultimaKey"))+1);
    mostrarNotas();
 }

 function mostrarNotas() {
    mosaico.innerHTML = "";
    if(JSON.parse(localStorage.getItem("key")) == null) {
        return;
    }

    keys = JSON.parse(localStorage.getItem("key"));
    
    for(let key of keys) {
        let div = document.createElement("div");
        let p = document.createElement("p");
        p.textContent = localStorage.getItem(key);
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
    }
 }

function gestionarNota(e) {
    if(e.target.id == "btnEditar") {

        let key = e.target.dataset.key;
        inputNota.value = localStorage.getItem(key);
        botonEditar.style.display = "block";
        botonCrear.style.display = "none";
        botonEditar.setAttribute("data-key", key);

    } else if(e.target.id == "btnEliminar") {

        let key = e.target.dataset.key;
        localStorage.removeItem(key);
        keys = keys.filter(k => k != key);
        localStorage.setItem("key", JSON.stringify(keys));
        mostrarNotas();

    }
}

function editarNota() {
    if(inputNota.value == "") {
        alert("La nota no puede estar vacía");
        return;
    }
    localStorage.setItem(botonEditar.dataset.key, inputNota.value);
    inputNota.value = "";
    botonEditar.style.display = "none";
    botonCrear.style.display = "block";
    mostrarNotas();
}