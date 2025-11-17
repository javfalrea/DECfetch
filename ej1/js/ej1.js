/* EJEMPLO DE CONSULTA EN BD USANDO METODO GET */

fetch("http://localhost:9999/buscarClientePorId?id=1", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((respuesta) => respuesta.json())
  .then((datos) => {
    console.log(datos.nombre + " " + datos.apellido);
  });


// Consultar TODOS los clientes.

fetch("http://localhost:9999/buscarTodosLosClientes", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((respuesta) => respuesta.json())
  .then((respuesta) => {
    console.log(respuesta);
  });

  /** 


// Insertar un clientes.

let insertarCliente = {
  id: 3,  //No le hace caso por ser autoincrementado en backend
  nombre: "Pepa",
  apellido: "Perez",
  fechaNacimiento: "2025-10-31",
  telefono: 55555,
  dni: "22222222E",
};

fetch("http://localhost:9999/crearCliente", {
  method: "POST",
  body: JSON.stringify(insertarCliente),
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((respuesta) => respuesta.text())
  .then((respuesta) => {
    if (respuesta === "Ok") {
      alert("Cliente insertado correctamente");
    } else {
      alert("Error al insertar cliente");
    }
  })
  .catch((error) => {
    console.log(error);
  });

*/

// Eliminar un clientes.

let id = 4;

fetch("http://localhost:9999/eliminarCliente?id=" + id, {
  method: "DELETE",
  headers: {
    "Content-Type": "application/text",
  },
})
  .then((respuesta) => respuesta.text())
  .then((respuesta) => {
    if (respuesta === "Ok") {
      mensajeExito("eliminado");
    } else {
      mensajeError("eliminar");
    }
  })
  .catch((error) => {
    console.log(error);
  });

// Actualizar un clientes.

let actualizarCliente = {
  id: 1,
  nombre: "Pepa",
  apellido: "Morales",
  fechaNacimiento: "2025-10-31",
  telefono: 222222,
  dni: "22222222E",
};

fetch("http://localhost:9999/actualizarCliente", {
  method: "PUT",
  body: JSON.stringify(actualizarCliente),
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((respuesta) => respuesta.text())
  .then((respuesta) => {
    if (respuesta === "Ok") {
      mensajeExito("actualizado");
    } else {
      mensajeError("actualizar");
    }
  })
  .catch((error) => {
    console.log(error);
  });