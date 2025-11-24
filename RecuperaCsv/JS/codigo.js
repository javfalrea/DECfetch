document.addEventListener("DOMContentLoaded", mostrarTabla);
const tbody = document.getElementById("tbody");
const boton = document.getElementById("boton");
boton.addEventListener("click", insertarDatos);

let organizaciones = [];

function mostrarTabla() {
    fetch("./Organization_v3.csv")

    .then(response => response.text())

    .then(data => {
        let arrayDatosPorFila = data.split("\n").slice(1);
    
        for(let fila of arrayDatosPorFila) {
            let tr = document.createElement("tr");
            let td1 = document.createElement("td");
            let td2 = document.createElement("td");
            let td3 = document.createElement("td");
            let td4 = document.createElement("td");

            let arrayFila = fila.split(",");

            td1.textContent = arrayFila[0];
            td1.setAttribute("style", "text-align: center;")
            tr.appendChild(td1);
            td2.textContent = arrayFila[1];
            td2.setAttribute("style", "text-align: center;")
            tr.appendChild(td2);
            td3.textContent = arrayFila[2];
            td3.setAttribute("style", "text-align: center;")
            tr.appendChild(td3);
            td4.textContent = arrayFila[3];
            td4.setAttribute("style", "text-align: center;")
            tr.appendChild(td4);             

            tbody.appendChild(tr);

            let organizacion = {id: arrayFila[0], tipo: arrayFila[1], localizacion: arrayFila[2], nombre: arrayFila[3]};

            organizaciones.push(organizacion);
        }
    })
}

function insertarDatos() {
    for(let o of organizaciones) {
        fetch("https://localhost:9999/crearOrganizacion?id=" + o.id + "&tipo=" + o.tipo + "&localizacion=" + o.localizacion + "&nombre=" + nombre, {
            method: "POST"
        })

        .then(response => response.j)
    }
}