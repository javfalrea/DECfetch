//Inicializamos un array en el que introduciremos los productos para no tener que realizar constantemente peticiones al servidor.
let productos = [];

const idp = document.getElementById("id");
const codigo = document.getElementById("codigo");
const nombre = document.getElementById("producto");
const precio = document.getElementById("precio");
const cantidad = document.getElementById("cantidad");

const form = document.getElementById("frm");

const botonRegistrar = document.getElementById("registrar");
botonRegistrar.addEventListener("click", editarORegistrarProducto);

const inputBusqueda = document.getElementById("buscar");
inputBusqueda.addEventListener("keyup", buscarProductos);

const tbody = document.getElementById("resultado");
tbody.addEventListener("click", gestionarProducto);

document.addEventListener("DOMContentLoaded", cargarTodos);

//Función para cargar los datos de la base de datos
function cargarTodos() {
    fetch("http://localhost:9999/buscarTodosLosProductos", {
        method: "GET",
    })

    .then(respuesta => {
        if (respuesta.ok) {
            return respuesta.json();
        } else {
            throw new Error(respuesta.status);
        }
    })

    .then(respuesta => {
        productos = respuesta;
        buscarProductos();
    })
}

//Función para registrar productos
function registrarProducto() {
    const miForm = new FormData(form);
    const jsonData = Object.fromEntries(miForm);
    const jsonString = JSON.stringify(jsonData);

    fetch("http://localhost:9999/crearProducto", {
        method: "POST",
        body: jsonString,
        headers: {
            "Content-Type": "application/json",
        },
    })

    .then((respuesta) => respuesta.text())
    .then((respuesta) => {
      if (respuesta === "Ok") {
        cargarTodos();
        alert("Producto insertado");
      } else {
        alert("No ha sido posible insertar el producto");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

//Función para buscar productos desde el array cargado desde un inicio
function buscarProductos() {
    tbody.innerHTML = "";
    let filtro = inputBusqueda.value.toLowerCase();
    let productosFiltrados = productos.filter(p => p.id.toString().includes(filtro) || p.producto.toLowerCase().includes(filtro));

    for(let p of productosFiltrados) {
        let tr = document.createElement("tr");

        let td1 = document.createElement("td");
        td1.textContent = p.id;
        tr.appendChild(td1);

        let td2 = document.createElement("td");
        td2.textContent = p.producto;
        tr.appendChild(td2);

        let td3 = document.createElement("td");
        td3.textContent = p.precio;
        tr.appendChild(td3);

        let td4 = document.createElement("td");
        td4.textContent = p.cantidad;
        tr.appendChild(td4);

        let td5 = document.createElement("td");

        let botonEditar = document.createElement("button");
        botonEditar.className = "editar btn btn-outline-warning";
        botonEditar.value = p.id;
        botonEditar.textContent = "Editar";
        td5.appendChild(botonEditar);

        let botonEliminar = document.createElement("button");
        botonEliminar.className = "eliminar btn btn-outline-danger";
        botonEliminar.value = p.id;
        botonEliminar.textContent = "Eliminar";
        td5.appendChild(botonEliminar);

        tr.appendChild(td5);
        tbody.appendChild(tr);
    }

}

//Función para gestionar con delegación de eventos los botones editar y eliminar de cada fila de la tabla.
function gestionarProducto(e) {
    if(e.target.tagName == "BUTTON") {
        if(e.target.classList.contains("editar")) {
            cargarActualizacion(e.target.value);
        } else if(e.target.classList.contains("eliminar")) {
            eliminarProducto(e.target.value);
        }
    }
}

//Función para eliminar los productos según el id
function eliminarProducto(id) {
    if(confirm("¿Estás seguro de eliminar este producto?")) {
        fetch('http://localhost:9999/eliminarProducto?id=' + id, {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/text'
            }
        })

        .then(respuesta => respuesta.text())

        .then(respuesta => {
            if(respuesta == "Ok") {
                alert("Producto eliminado");
                let productosActualizados = productos.filter(p => p.id != id);
                productos = productosActualizados; // Estas dos últimas líneas sirven para eliminar el producto también del array y no llamamos al backend
                buscarProductos();
            } else {
                alert("El producto no ha podido ser eliminado");
            }
        })

        .catch((e) => {
            console.log(e)
        });
    }
}

//Función para editar el producto según el id
function editarProducto(id) {
    const miForm = new FormData(form);
    const jsonData = Object.fromEntries(miForm);
    const jsonString = JSON.stringify(jsonData);

    fetch('http://localhost:9999/actualizarProducto?id=' + id, {
        method: 'PUT',
        body: jsonString,
        headers: {
            'Content-Type': 'application/json'
        }
    })

    .then(respuesta => respuesta.text())

    .then(respuesta => {
        if(respuesta == "Ok") {
            alert("Producto actualizado");
            cargarTodos();

        } else {
            alert("No se ha podido actualizar el producto")
        }
    })

    .catch((e) => {
        console.log(e);
    });
}

//Función para elegir editar o registrar según el estado del formulario
function editarORegistrarProducto() {
    if(botonRegistrar.value == "Registrar") {
        registrarProducto();
        limpiarFormulario();
    } else {
        editarProducto(idp.value);
        limpiarFormulario();
    }

}

//Función que cambia el formulario en formato registro a edición
function cargarActualizacion(id) {
    let producto = productos.find(p => p.id == id);

    idp.value = id;
    codigo.value = producto.codigo;
    nombre.value = producto.producto;
    precio.value = producto.precio;
    cantidad.value = producto.cantidad;

    botonRegistrar.value = "Editar";
}

//Función que limpia el formulario
function limpiarFormulario() {
    idp.value = "";
    codigo.value = "";
    nombre.value = "";
    precio.value = "";
    cantidad.value = "";
    botonRegistrar.value = "Registrar";
    botonRegistrar.textContent = "Registrar";
}