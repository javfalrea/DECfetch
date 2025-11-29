let reservas = [];

document.addEventListener("DOMContentLoaded", inicializarApp);

const tablaButacas = document.getElementById("butacas");
let fechaR = document.getElementById("fechaReserva");
let horaR = document.getElementById("horaReserva");

/**
 * Carga todas las reservas desde el servidor.
 * Retorna la Promise del fetch para encadenar acciones.
 */
function cargarReservas() {
    return fetch("http://localhost:9999/buscarTodasLasReservas", {
        method: "GET"
    })
    .then(respuesta => respuesta.json())
    .then(data => {
        // Aseguramos que 'reservas' se actualice con los datos
        reservas = data;
        return data; 
    })
    .catch(error => {
        console.error("Error al cargar las reservas:", error);
        return [];
    });
}

/**
 * Función principal para inicializar la aplicación.
 * Asegura que las reservas se carguen antes de mostrar las butacas.
 */
function inicializarApp() {
    // 1. Cargamos las reservas
    cargarReservas()
        .then(() => {
            // 2. Solo después de cargar, mostramos las butacas
            mostrarButacas();
        })
        .catch(error => {
            console.error("Fallo crítico en inicializarApp:", error);
            mostrarButacas(); // Mostrar al menos la estructura si falla la carga
        });
}

function mostrarButacas() {
    
    for(let i=1; i<=10; i++) {
        const row = String(i).padStart(2, '0');
        
        let tr = document.createElement("tr");
        for(let j=1; j<=20; j++) {
            
            const col = String(j).padStart(2, '0');
            const id = "B" + row + col;

            let td = document.createElement("td");
            
            let icono = document.createElement("i");
            icono.setAttribute("id", id);
            icono.setAttribute("data-row", row);
            icono.setAttribute("data-col", col);
            icono.setAttribute("aria-hidden", true);
            icono.classList = "fa-solid fa-couch";
            
            // Asignar el estado inicial basándose en la butaca actual
            actualizarButacaIndividual(icono);
            
            td.appendChild(icono);
            tr.appendChild(td);
        }

        tablaButacas.appendChild(tr);
    }
}

// Función auxiliar para comprobar si una butaca está reservada según la fecha/hora actual
function actualizarButacaIndividual(butacaElement) {
    const fechaReserva = fechaR.value;
    const horaReserva = horaR.value;
    
    // Si no hay fecha/hora seleccionada
    if (!fechaReserva || !horaReserva) {
        butacaElement.dataset.reservada = "false";
        butacaElement.style.color = "blue";
        return;
    }

    // Buscamos si la butaca ya está en la lista de reservas cargadas
    const estaReservada = reservas.some(r => 
        r.butacaReserva === butacaElement.id && 
        r.horaReserva === horaReserva && 
        r.fechaReserva === fechaReserva
    );

    if (estaReservada) {
        butacaElement.dataset.reservada = "true";
        butacaElement.style.color = "red";
    } else {
        butacaElement.dataset.reservada = "false";
        butacaElement.style.color = "blue";
    }
}


tablaButacas.addEventListener("click", manejarCrearEliminarReserva);

function manejarCrearEliminarReserva(e) {
    
    const fechaReserva = fechaR.value;
    const horaReserva = horaR.value;

    if(e.target.tagName === "I") {
        if(fechaReserva === "" || horaReserva === "") {
            alert("Debes seleccionar fecha y hora de reserva.");
        } else {

            if(e.target.dataset.reservada === "false") {
                // Lógica para CREAR Reserva

                const reserva = {fechaReserva: fechaReserva, horaReserva: horaReserva, butacaReserva: e.target.id};
                
                // Si ya está en la lista local, no intentar crear (protección básica de la UI)
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
                            // CORRECCIÓN CLAVE: Forzar la recarga de la matriz 'reservas' para obtener el idReserva generado.
                            // Esto asegura que la próxima vez que se haga clic para ELIMINAR, tendremos el ID.
                            return cargarReservas().then(() => {
                                console.log("Seleccionaste la butaca de la fila " + e.target.dataset.row + ", columna " + e.target.dataset.col);
                                e.target.dataset.reservada = "true";
                                e.target.style.color = "red";
                            });
                        } else {
                            alert("No se ha podido reservar la butaca.")
                        }
                    })
                    .catch(error => {
                        console.error("Error en la creación de reserva:", error);
                        alert("Error de conexión o servidor al crear la reserva.");
                    });
                } else {
                    alert("Butaca ya reservada");
                }

            } else {
                // Lógica para ELIMINAR Reserva

                // **CORRECCIÓN CLAVE:** Buscamos el objeto de reserva completo que contiene el idReserva
                // utilizando el ID de la butaca (e.target.id), la fecha y la hora seleccionadas.
                const reservaAEliminar = reservas.find(r => 
                    r.butacaReserva === e.target.id &&
                    r.fechaReserva === fechaReserva && 
                    r.horaReserva === horaReserva 
                );

                if (reservaAEliminar && reservaAEliminar.idReserva) {
                    const id = reservaAEliminar.idReserva;

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
                            
                            // Eliminar de la matriz local 'reservas' usando el ID de la BD
                            const index = reservas.findIndex(r => r.idReserva == id);
                            if(index !== -1) {
                                reservas.splice(index, 1);
                            }
                        } else {
                            alert("No se ha podido eliminar la reserva.");
                        }
                    })
                    .catch(error => {
                        console.error("Error en la eliminación de reserva:", error);
                        alert("Error de conexión o servidor al eliminar la reserva.");
                    });

                } else {
                    alert("Error: No se encontró el ID de la reserva en la lista actual. Intenta recargar la página.");
                }
            }
        }
    }
}


fechaR.addEventListener("change", actualizarButacas);
horaR.addEventListener("change", actualizarButacas);

/**
 * Actualiza el color de todas las butacas basado en la fecha y hora seleccionadas.
 */
function actualizarButacas() {

    const butacas = document.getElementsByTagName("i");
    const fechaActual = fechaR.value;
    const horaActual = horaR.value;

    if(fechaActual === "" || horaActual === "") {
        // Resetear todas las butacas a 'libre' si falta fecha/hora
        for(let butaca of butacas) {
            butaca.dataset.reservada = "false";
            butaca.style.color = "blue";
        }
        return;
    }
    
    // Filtrar la matriz de reservas solo una vez
    const reservasHorario = reservas.filter(r => 
        r.horaReserva == horaActual && 
        r.fechaReserva == fechaActual
    );

    for(let butaca of butacas) {
        
        // 1. Asumir que la butaca está libre (estado por defecto)
        butaca.dataset.reservada = "false";
        butaca.style.color = "blue";

        // 2. Verificar si existe una reserva para la butaca actual
        const estaReservada = reservasHorario.some(r => r.butacaReserva === butaca.id);

        if(estaReservada) {
            // 3. Si se encuentra una reserva, actualizar el estado
            butaca.dataset.reservada = "true";
            butaca.style.color = "red";
        } 
    }
}