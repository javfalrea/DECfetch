document.addEventListener("DOMContentLoaded", mostrarTabla);
const tbody = document.getElementById("tbody");

async function mostrarTabla() {
    const response = await fetch("./Provincias.txt");
    const data = await response.text();

    let arrayDatosPorFila = data.split("\n");
    
    for(let fila of arrayDatosPorFila) {
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");

        let arrayFila = fila.split(",");

        td1.textContent = arrayFila[0];
        td1.setAttribute("style", "text-align: center;")
        tr.appendChild(td1);
        td2.textContent = arrayFila[2];
        td2.setAttribute("style", "text-align: center;")
        tr.appendChild(td2);
        td3.textContent = arrayFila[3];
        td3.setAttribute("style", "text-align: center;")

        tr.appendChild(td3);           
    

        tbody.appendChild(tr);
    }
    
}
