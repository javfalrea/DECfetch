let reservas = [];

document.addEventListener("DOMContentLoaded", cargarReservas);

function cargarReservas() {
    fetch("http://localhost:9999/buscarTodasLasReservas", {
        method: "GET"
    })

    .then(respuesta => respuesta.json())

    .then(respuesta => {
        reservas = respuesta;
    })
}

document.addEventListener("DOMContentLoaded", mostrarButacas);
const tablaButacas = document.getElementById("butacas");

function mostrarButacas() {
    let row = "";
    let col = "";
    let id = "";

    for(let i=1; i<=10; i++) {
        if(i == 10) {
            row = String(i);
        } else {
            row = "0" + String(i);
        }
        let tr = document.createElement("tr");
        for(let j=1; j<=20; j++) {
            if(j >= 10) {
                col = String(j);
            } else {
                col = "0" + String(j);
            }

            id = "B" + row + col;

            let td = document.createElement("td");
            
            let icono = document.createElement("i");
            icono.setAttribute("id", id);
            icono.setAttribute("data-row", row);
            icono.setAttribute("data-col", col);
            icono.style.color = "blue";
            icono.setAttribute("aria-hidden", true);
            icono.setAttribute("data-reservada", "false");
            icono.classList = "fa-solid fa-couch";

            td.appendChild(icono);
            tr.appendChild(td);
        }

        tablaButacas.appendChild(tr);
    }
}

tablaButacas.addEventListener("click", manejarCrearEliminarReserva);

let fechaR = document.getElementById("fechaReserva");
let horaR = document.getElementById("horaReserva");

function manejarCrearEliminarReserva(e) {
   
    const fechaReserva = fechaR.value;
    const horaReserva = horaR.value;

    if(e.target.tagName === "I") {
        if(fechaReserva === "" || horaReserva === "") {
            alert("Debes seleccionar fecha y hora de reserva.");
        } else {

            if(e.target.dataset.reservada === "false") {
                const reserva = {fechaReserva: fechaReserva, horaReserva: horaReserva, butacaReserva: e.target.id};
                const yaExiste = reservas.find(r => r.fechaReserva == reserva.fechaReserva && r.horaReserva == reserva.horaReserva && r.butacaReserva == reserva.butacaReserva);

                if(!yaExiste) {

                    const jsonString = JSON.stringify(reserva);

                    fetch("http://localhost:9999/crearReserva", {
                        method: "POST",
                        body: jsonString,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })

                    .then(respuesta => respuesta.text())

                    .then(respuesta => {
                        if(respuesta === "Ok") {
                            cargarReservas();
                            console.log("Seleccionaste la butaca de la fila " + e.target.dataset.row + ", columna " + e.target.dataset.col);
                            e.target.dataset.reservada = "true";
                            e.target.style.color = "red";
                        } else {
                            alert("No se ha podido reservar la butaca.")
                        }
                    })
                } else {
                    alert("Butaca ya reservada");
                }

            } else {
                let id;

                let arrayFechaReserva = fechaReserva.split("-");
                let fechaReservaFormateada = arrayFechaReserva[1] + "/" + arrayFechaReserva[2] + "/" + arrayFechaReserva[0];

                
                fetch("http://localhost:9999/buscarReservaPorFecha?fechaReserva=" + fechaReservaFormateada, {
                    method: "GET",
                })

                .then(respuesta => respuesta.json())

                .then(respuesta => {
                    let butacaAEliminar = respuesta.find(r => r.horaReserva == horaReserva && r.butacaReserva == e.target.id);
                    id = butacaAEliminar.idReserva;

                    fetch("http://localhost:9999/eliminarReserva?id=" + id, {
                        method: "DELETE",
                        headers: {
                            'Content-Type': 'application/text'
                        }
                    }) 

                    .then(response => response.text()) 

                    .then(response => {
                        if(response === "Ok") {
                            console.log("Has deseleccionado la butaca en la fila " + e.target.dataset.row + ", columna " + e.target.dataset.col);
                            e.target.dataset.reservada = "false";
                            e.target.style.color = "blue";
                            for(let i=0; i<reservas.length; i++) {
                                if(reservas[i].idReserva == id) {
                                    reservas.splice(i, 1);
                                }
                            }
                        } else {
                            alert("No se ha podido eliminar la reserva.");
                        }
                    })
                })

            }
        }
    }
}



fechaR.addEventListener("change", actualizarButacas);
horaR.addEventListener("change", actualizarButacas);

function actualizarButacas() {

    const butacas = document.getElementsByTagName("i");

    let reservasHorario = reservas.filter(r => r.horaReserva == horaR.value && r.fechaReserva == fechaR.value);

    for(let butaca of butacas) {
        
        for(let r of reservasHorario) {
            if(r.butacaReserva == butaca.id) {
                butaca.dataset.reservada = "true";
                butaca.style.color = "red";
            } else {
                butaca.dataset.reservada = "false";
                butaca.style.color = "blue";
            }
        }

    }
}
