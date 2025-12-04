//Ejercicio1
const numero1 = prompt("Escribe un número");
const numero2 = prompt("Escribe un número");
const numero3 = prompt("Escribe un número");
const numero4 = prompt("Escribe un número");
const numero5 = prompt("Escribe un número");

localStorage.setItem("numero1", numero1);
localStorage.setItem("numero2", numero2);
localStorage.setItem("numero3", numero3);
localStorage.setItem("numero4", numero4);
localStorage.setItem("numero5", numero5);


//Ejercicio2
const usuario1 = {nombre: "nombre1", apellidos: "apellidos1"};
const usuario1String = JSON.stringify(usuario1);
localStorage.setItem("usuario1", usuario1String);


//Ejercicio3
const usuario2 = {nombre: "nombre2", apellidos: "apellidos2"};
const usuario3 = {nombre: "nombre3", apellidos: "apellidos3"};
const usuario4 = {nombre: "nombre4", apellidos: "apellidos4"};
const usuario5 = {nombre: "nombre5", apellidos: "apellidos5"};

const usuarios = [usuario1, usuario2, usuario3, usuario4, usuario5];
const usuariosString = JSON.stringify(usuarios);
localStorage.setItem("usuarios", usuariosString);


//Ejercicio4
const tbody = document.getElementById("tbody");

function mostrarDatos() {
    for(let i=0; i<localStorage.length; i++) {
        let tr = document.createElement("tr");

        let td1 = document.createElement("td");
        const key = localStorage.key(i);
        td1.textContent = key;
        tr.appendChild(td1);

        let td2 = document.createElement("td");
        td2.textContent = localStorage.getItem(key);
        tr.appendChild(td2);

        let td3 = document.createElement("td");
        td3.textContent = i+1;
        tr.appendChild(td3);
        
        tbody.appendChild(tr);
    }
}

mostrarDatos();
