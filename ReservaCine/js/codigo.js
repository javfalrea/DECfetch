const fechaReserva = document.getElementById("fechaReserva");
const horaReserva = document.getElementById("horaReserva");
const tablaButacas = document.getElementById("butacas");

horaReserva.addEventListener("change", mostrarButacas);
fechaReserva.addEventListener("change", buscarReservasPorFecha);
tablaButacas.addEventListener("click", gestionarReservas);

let reservas = [];

function buscarReservasPorFecha() {
    
    fetch("http://localhost:9999/buscarReservaPorFecha?fechaReserva=" + fechaReserva.value, {
        method: "GET"
    })

    .then(respuesta => respuesta.json())

    .then(respuesta => {
        reservas = respuesta;
        horaReserva.value = "";
        tablaButacas.innerHTML = ""; //Esto lo ponemos porque al cambiar la fecha se mantienen las butacas con los colores de la última tabla mostrada.
    })

}

function mostrarButacas() {

    if(fechaReserva.value == "") {
        alert("Seleccione antes una fecha");
        horaReserva.value = "";
        return;
    } 

    tablaButacas.innerHTML = "";
    let reservasPorHora = [];

    if(horaReserva.value == "18:00:00") {
        reservasPorHora = reservas.filter(r => r.horaReserva == "18:00:00");
    } else if(horaReserva.value == "20:00:00") {
        reservasPorHora = reservas.filter(r => r.horaReserva == "20:00:00");
    } else if(horaReserva.value == "22:00:00") {
        reservasPorHora = reservas.filter(r => r.horaReserva == "22:00:00");
    }

    let butacasReservadas = reservasPorHora.map(r => r.butacaReserva);
    let fila;
    let columna;

    for(let i=1; i<=10; i++) {
        if(i == 10) {
            fila = String(i);
        } else {
            fila = String(0) + i;
        }
        let tr = document.createElement("tr");
        for(let j=1; j<=20; j++) {
            if(j >=10) {
                columna = String(j);
            } else {
                columna = String(0) + j;
            }

            let idButaca = "B" + fila + columna;

            let td = document.createElement("td");
            let butaca = document.createElement("i");
            butaca.setAttribute("id", idButaca);
            butaca.className = "fa-solid fa-couch";
            butaca.setAttribute("aria-hidden", "true");
            butaca.setAttribute("data-row", i);
            butaca.setAttribute("data-col", j);

            if(butacasReservadas.includes(idButaca)) {
                butaca.style.color = "red";
            } else {
                butaca.style.color = "blue";
            }

            td.appendChild(butaca);
            tr.appendChild(td);
           
        }
        
        tablaButacas.appendChild(tr);

    }
}


function gestionarReservas(e) {

    if(e.target.tagName !== "I") {
        return;
    }

    if(e.target.style.color == "blue") {

        let objetoReserva = {fechaReserva: fechaReserva.value, horaReserva: horaReserva.value, butacaReserva: e.target.id};
        let jsonString = JSON.stringify(objetoReserva);

        fetch("http://localhost:9999/crearReserva", {
            method: "POST",
            body: jsonString,
            headers: {
                'Content-Type': 'application/json' 
            }
        })

        .then(respuesta => respuesta.text())

        .then(r => {
            if(r === "Ok") {
                console.log("Se ha seleccionado la butaca en la fila " + e.target.dataset.row + " y columna " + e.target.dataset.col);
                e.target.style.color = "red"; //Esto lo hacemos porque aún no llamamos al mostrarButacas, entonces aunque metamos la reserva, el color hay que cambiarlo manualmente.
                
                fetch("http://localhost:9999/buscarReservaPorFecha?fechaReserva=" + fechaReserva.value, {
                    method: "GET"
                })

                .then(respuesta => respuesta.json())

                .then(respuesta => {
                    reservas = respuesta;
                })
                
            } else {
                alert("No se ha podido llevar a cabo la reserva");
            }
        })
    
    } else if(e.target.style.color == "red") {

        let reserva = reservas.find(r => r.horaReserva == horaReserva.value && r.fechaReserva == fechaReserva.value && r.butacaReserva == e.target.id);
        
        fetch("http://localhost:9999/eliminarReserva?idReserva=" + reserva.idReserva, {
            method: "DELETE"
        })

        .then(respuesta => respuesta.text())

        .then(r => {
            if(r === "Ok") {
                console.log("Se ha deseleccionado la butaca en la fila " + e.target.dataset.row + " y columna " + e.target.dataset.col);
                e.target.style.color = "blue";
                const posicion = reservas.findIndex(r => r.idReserva == reserva.idReserva);
                reservas.splice(posicion, 1);
            } else {
                alert("No se ha podido cancelar la reserva");
            }
        })
    }

}