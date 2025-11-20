document.addEventListener("DOMContentLoaded", mostrarButacas);
const tablaButacas = document.getElementById("butacas");

function mostrarButacas() {
    let row = "";
    let col = "";
    let id = "";

    for(let i=1; i<=10; i++) {
        if(i == 10) {
            row = toString(i);
        } else {
            row = "0" + toString(i);
        }
        let tr = document.createElement("tr");
        for(let j=1; j<=20; j++) {
            if(j >= 10) {
                col = toString(i);
            } else {
                col = "0" + toString(i);
            }

            id = "B" + row + col;

            let td = document.createElement("td");
            
            //let i = document.createElement("i");
            td.innerHTML = "<i id=" + id + "class='fa-solid fa-couch' aria-hidden='true' style='color: blue;' data-row=" + row + " data-col=" + col + ">";
        }
    }
}
