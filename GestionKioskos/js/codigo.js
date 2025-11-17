let articulos = [];
let ids = [];

const inicio = document.getElementById("inicio");
const regArticulos = document.getElementById("regArticulos");
const ventaArticulos = document.getElementById("ventaArticulos");
const informeAlmacen = document.getElementById("informeAlmacen");
const informeVenta = document.getElementById("informeVenta");

const nombreRegistro = document.getElementById("nombreRegistro");
const categoriaRegistro = document.getElementById("categoriaRegistro");
const numExistenciasRegistro = document.getElementById("numExistenciasRegistro");
const precioRegistro = document.getElementById("precioRegistro");

const categoriaVenta = document.getElementById("categoriaVenta");
const nombreVenta = document.getElementById("nombreVenta");
const precioVenta = document.getElementById("precioVenta");
const unidadesVenta = document.getElementById("unidadesVenta");

const contenido = document.getElementById("contenido");
const formRegistro = document.getElementById("formRegistro");
const formVenta = document.getElementById("formVenta");
const infArticulos = document.getElementById("infArticulos");
const infVentas = document.getElementById("infVentas");

const botonRegistrar = document.getElementById("botonRegistrar");
const botonVenta = document.getElementById("botonVenta");
const botonSeguirVendiendo = document.getElementById("botonSeguirVendiendo");

document.addEventListener("DOMContentLoaded", limpiarTodo);
inicio.addEventListener("click", limpiarTodo);
regArticulos.addEventListener("click", mostrarFormRegistro);
ventaArticulos.addEventListener("click", mostrarFormVenta);
informeAlmacen.addEventListener("click", mostrarInformeArticulos);
informeVenta.addEventListener("click", mostrarInformeVentas);
categoriaVenta.addEventListener("change", habilitarEleccionArticulo);
nombreRegistro.addEventListener("keyup", registrarOActualizar);
botonVenta.addEventListener("click", registrarVenta);
botonSeguirVendiendo.addEventListener("click", mostrarListaVendiendo);

//Limpia todos los formularios del contenido
function limpiarTodo() {
    formRegistro.style.display = "none";
    formVenta.style.display = "none";
    infArticulos.style.display = "none";
    infVentas.style.display = "none";
}

//Muestra el únicamente el formulario de registro
function mostrarFormRegistro() {
    limpiarTodo();
    formRegistro.style.display = "block";
}

//Muestra únicamente el formulario de venta
function mostrarFormVenta() {
    limpiarTodo();
    formVenta.style.display = "block";
}

//Muestra únicamente el informe de los artículos almacenados
function mostrarInformeArticulos() {
    limpiarTodo();
    infArticulos.style.display = "block";
}

//Muestra únicamente el informe de las ventas realizadas
function mostrarInformeVentas() {
    limpiarTodo();
    infVentas.style.display = "block";
}

function cargaInicial() {
    fetch("http://localhost:9999/buscarTodosLosArticulos", {
        method: "GET"
    })

    .then(respuesta => respuesta.json())

    .then(respuesta => {
        articulos = respuesta;
        for(let i=1; i<=articulos.length; i++) {
            ids.push(i);
        }
    })
}

//Cambia la lógica del botón de registro según nos interese actualizar o crear un nuevo producto
function registrarOActualizar() {
    botonRegistrar.removeEventListener("click", registrarArticulo);
    botonRegistrar.removeEventListener("click", actualizarArticulo);
    if(articulos.find(a => a.nombreArticulo == nombreRegistro.value)) {
        botonRegistrar.textContent = "Actualizar producto";
            botonRegistrar.addEventListener("click", actualizarArticulo);
    } else {
        botonRegistrar.textContent = "Registrar producto";
        botonRegistrar.addEventListener("click", registrarArticulo);
    }
}


//Registra el artículo en la base de datos
function registrarArticulo() {
    const miForm = new FormData(formRegistro);
    const jsonData = Object.fromEntries(miForm);
    const jsonString = JSON.stringify(jsonData);

    fetch("http://localhost:9999/crearArticulo", {
        method: "POST",
        body: jsonString,
        headers: {
            "Content-Type": "application/json"
        }
    })

    .then(respuesta => respuesta.text())

    .then(respuesta => {
        if(respuesta == "Ok") {
            alert("Artículo registrado con éxito");
            articulos.push(jsonData);
            ids.push(ids.length+1);
        } else {
            alert("No se ha podido registrar el producto");
        }
    })
}

//Actualiza el artículo en la base de datos
function actualizarArticulo() {
    const miForm = new FormData(formRegistro);
    const jsonData = Object.fromEntries(miForm);
    const jsonString = JSON.stringify(jsonData);

    fetch("http://localhost:9999/actualizarArticulo", {
        method: "PUT",
        body: jsonString,
        headers: {
            "Content-Type": "application/json"
        }
    })

    .then(respuesta => respuesta.text())

    .then(respuesta => {
        if(respuesta == "Ok") {
            alert("Artículo actualizado con éxito");
            let posicion = articulos.findIndex(a => a.nombreArticulo == nombreRegistro.value);
            articulos[posicion] = jsonData;
        } else {
            alert("No se ha podido actualizar el producto");
        }
    })
}


function cargarArticulosPorCategoria(categoria) {
    nombreVenta.innerHTML = "";
    let fstOption = document.createElement("option");
    fstOption.textContent = "Selecciona un artículo";
    fstOption.value = "";
    nombreVenta.appendChild(fstOption);
    
    let articulosPorCategoria = articulos.filter(a => a.categoriaArticulo == categoria);

    for(let a of articulosPorCategoria) {
        let producto = a.nombreArticulo;
        let option = document.createElement("option");
        option.textContent = producto;
        let posicion = articulos.findIndex(a => a.nombreArticulo == producto);
        option.value = posicion;
        nombreVenta.appendChild(option);
    }
}

function habilitarEleccionArticulo() {
    let categoria = categoriaVenta.value;
    nombreVenta.disabled = false;
    cargarArticulosPorCategoria(categoria);
}
