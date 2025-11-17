const btnConsultarPorId = document.getElementById("btnConsultarPorId");
const btnRegistrarCliente = document.getElementById("btnRegistrarCliente");
const btnConsultarTodos = document.getElementById("btnConsultarTodos");
const btnEliminarCliente = document.getElementById("btnEliminarCliente");
const btnEditarCliente = document.getElementById("btnEditarCliente");
const select = document.getElementById("id");


btnConsultarPorId.addEventListener("click", mostrarDatosPorId);
btnRegistrarCliente.addEventListener("click", registrarCliente);
btnConsultarTodos.addEventListener("click", consultarTodos);
btnEliminarCliente.addEventListener("click", eliminarCliente);
btnEditarCliente.addEventListener("click", actualizarCliente);

//Clase table striped por listado

/* EJEMPLO DE CONSULTA EN BD USANDO METODO GET */
function mostrarDatosPorId() {
  const capaExistente = document.getElementById("Listado");
  if (capaExistente) {
    capaExistente.remove();
  }

  let capa = document.createElement("div");
  capa.setAttribute("id", "Listado");
  capa.setAttribute("style", "margin:auto; text-align: center;");
  let idCliente = document.getElementById("id").value;

  fetch("http://localhost:9999/buscarClientePorId?id=" + idCliente, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((respuesta) => {
      if (respuesta.ok) return respuesta.json();

      throw new Error(respuesta.status);
    })

    .then((datos) => {
      if (datos) {
        let nombre = document.createElement("td");
        nombre.textContent = datos.nombre;
        let apellidos = document.createElement("td");
        apellidos.textContent = datos.apellido;
        let filaBody = document.createElement("tr");
        filaBody.appendChild(nombre);
        filaBody.appendChild(apellidos);
        let body = document.createElement("tbody");
        body.appendChild(filaBody);

        let enc1 = document.createElement("th");
        enc1.textContent = "Nombre";
        let enc2 = document.createElement("th");
        enc2.textContent = "Apellidos";
        let filaEnc = document.createElement("tr");
        filaEnc.appendChild(enc1);
        filaEnc.appendChild(enc2);
        let encabezado = document.createElement("thead");
        encabezado.appendChild(filaEnc);
        let tabla = document.createElement("table");
        tabla.appendChild(encabezado);
        tabla.appendChild(body);

        tabla.className = "table table-striped";

        capa.appendChild(tabla);
      }
    })

    .catch((error) => {
      console.log("Error" + error + " Cliente no encontrado");
    });

  document.body.appendChild(capa);
}

// Consultar TODOS los clientes.

function consultarTodos() {
  const capaExistente = document.getElementById("Listado");
  if (capaExistente) {
    capaExistente.remove();
  }

  let capa = document.createElement("div");
  capa.setAttribute("id", "Listado");
  capa.setAttribute("style", "margin:auto; text-align: center;");

  fetch("http://localhost:9999/buscarTodosLosClientes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((respuesta) => {
      if (respuesta.ok) return respuesta.json();
      throw new Error(respuesta.status);
    })

    .then((respuesta) => {
      let tabla = document.createElement("table");
      let trhead = document.createElement("tr");
      let th1 = document.createElement("th");
      th1.textContent = "Id";
      trhead.appendChild(th1);
      let th2 = document.createElement("th");
      th2.textContent = "Nombre";
      trhead.appendChild(th2);
      let th3 = document.createElement("th");
      th3.textContent = "Apellido";
      trhead.appendChild(th3);
      let th4 = document.createElement("th");
      th4.textContent = "Fecha de nacimiento";
      trhead.appendChild(th4);
      let th5 = document.createElement("th");
      th5.textContent = "Teléfono";
      trhead.appendChild(th5);
      let th6 = document.createElement("th");
      th6.textContent = "DNI";
      trhead.appendChild(th6);
      tabla.appendChild(trhead);

      for (let r of respuesta) {
        let trbody = document.createElement("tr");
        let td1 = document.createElement("td");
        td1.textContent = r.id;
        trbody.appendChild(td1);
        let td2 = document.createElement("td");
        td2.textContent = r.nombre;
        trbody.appendChild(td2);
        let td3 = document.createElement("td");
        td3.textContent = r.apellido;
        trbody.appendChild(td3);
        let td4 = document.createElement("td");
        const fecha = new Date(r.fechaNacimiento);
        const fechaFormateada = fecha.toLocaleDateString('es-ES');
        td4.textContent = fechaFormateada;
        trbody.appendChild(td4);
        let td5 = document.createElement("td");
        td5.textContent = r.telefono;
        trbody.appendChild(td5);
        let td6 = document.createElement("td");
        td6.textContent = r.dni;
        trbody.appendChild(td6);
        tabla.appendChild(trbody);
      }

      tabla.className = "table table-striped";
      capa.appendChild(tabla);
      document.body.appendChild(capa);
    }); 
}

// Insertar un clientes.
function registrarCliente() {
  const miForm = new FormData(formRegistrarCliente);
  const jsonData = Object.fromEntries(miForm); // Convierte FormData en un objeto JavaScript
  const jsonString = JSON.stringify(jsonData);

  alert(jsonString);

  fetch("http://localhost:9999/crearCliente", {
    method: "POST",
    body: jsonString,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((respuesta) => respuesta.text())
    .then((respuesta) => {
      if (respuesta === "Ok") {
        mensajeExito("insertado");
      } else {
        mensajeError("insertar");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}


function eliminarCliente() {
  const id = document.getElementById("id").value;

   fetch('http://localhost:9999/eliminarCliente?id=' + id, {
        method: 'DELETE', 
        headers: {
            'Content-Type': 'application/text'
        }
    })
      .then(respuesta => respuesta.text())
      .then(respuesta => {
        if (respuesta === "Ok") {
            mensajeExito("eliminado");          
        }else{
            mensajeError("eliminar");
        }
      })
      .catch((error) => {
        console.log(error)
      });
}

  // Actualizar un clientes.
function actualizarCliente() {
  const miForm = new FormData(formRegistrarCliente);
  const jsonData = Object.fromEntries(miForm); // Convierte FormData en un objeto JavaScript
  const jsonString = JSON.stringify(jsonData);

   fetch('http://localhost:9999/actualizarCliente', {
        method: 'PUT',
        body: jsonString,
        headers: {
            'Content-Type': 'application/json'
        }
    })
      .then(respuesta => respuesta.text())
      .then(respuesta => {
        if (respuesta === "Ok") {
            mensajeExito("actualizado");          
        }else{
            mensajeError("actualizar");
        }
      })
      .catch((error) => {
        console.log(error)
      });
}


// Alerta de éxito (reemplaza a alert())
function mensajeExito(accion) {
  Swal.fire({
    title: "¡Éxito!",
    text: `El cliente ha sido ${accion} correctamente.`,
    icon: "success",
    confirmButtonText: "Ok",
  });
}

function mensajeError(accion) {
  Swal.fire({
    title: "¡Oops! Algo salió mal",
    text: `Error al ${accion} el cliente`,
    icon: "error",
    confirmButtonText: "Ok",
  });
}

//Transformar el cuadro de texto de id en un select. El contendio del select será el nombre de cada cliente en formato apellidos, nombre.

 
function cargarSelect() {

  fetch("http://localhost:9999/buscarTodosLosClientes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })

    .then((respuesta) => {
      if (respuesta.ok) return respuesta.json();
      throw new Error(respuesta.status);
    })

    .then(respuesta => {
      for(let r of respuesta) {
        let option = document.createElement("option");
        option.value = r.id;
        option.textContent = r.nombre + " " + r.apellido;
        select.appendChild(option);
      }
    })

  }  

document.addEventListener("DOMContentLoaded", cargarSelect);