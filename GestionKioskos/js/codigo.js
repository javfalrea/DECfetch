let articulos = [];
let ventas = [];
let carrito = [];

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
const listadoCarrito = document.getElementById("listadoCarrito");
const tbody = document.getElementById("tbody");
const infArticulos = document.getElementById("infArticulos");
const tbodyIA = document.getElementById("tbodyIA");
const infVentas = document.getElementById("infVentas");
const tbodyIV = document.getElementById("tbodyIV");
const total = document.getElementById("total");

const botonRegistrar = document.getElementById("botonRegistrar");
const botonActualizar = document.getElementById("botonActualizar");
const botonVenta = document.getElementById("botonVenta");
const botonSeguirVendiendo = document.getElementById("botonSeguirVendiendo");

document.addEventListener("DOMContentLoaded", limpiarTodo);
document.addEventListener("DOMContentLoaded", cargaInicial);
inicio.addEventListener("click", limpiarTodo);
regArticulos.addEventListener("click", mostrarFormRegistro);
ventaArticulos.addEventListener("click", mostrarFormVenta);
informeAlmacen.addEventListener("click", mostrarInformeArticulos);
informeVenta.addEventListener("click", mostrarInformeVentas);
categoriaVenta.addEventListener("change", habilitarEleccionArticulo);
nombreRegistro.addEventListener("keyup", registrarOActualizar);
botonVenta.addEventListener("click", registrarVenta);
botonSeguirVendiendo.addEventListener("click", mostrarListaVendiendo);
botonRegistrar.addEventListener("click", registrarArticulo);
botonActualizar.addEventListener("click", actualizarArticulo);
nombreVenta.addEventListener("change", asignarPrecio);

//Limpia todos los formularios del contenido
function limpiarTodo() {
    formRegistro.style.display = "none";
    formVenta.style.display = "none";
    infArticulos.style.display = "none";
    infVentas.style.display = "none";
    listadoCarrito.style.display = "none";
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

//Limpia el formulario de registro
function limpiarFormRegistro() {
    nombreRegistro.value = "";
    categoriaRegistro.value = "";
    numExistenciasRegistro.value = "";
    precioRegistro.value = "";
}

function limpiarFormVenta() {
    nombreVenta.value = "";
    categoriaVenta.value = "";
    precioVenta.value = "";
    unidadesVenta.value = "";
}

//Carga los datos en un array
function cargaInicial() {
    fetch("http://localhost:9999/buscarTodosLosArticulos", {
        method: "GET"
    })

    .then(respuesta => respuesta.json())

    .then(respuesta => {
        articulos = respuesta;
    });

    fetch("http://localhost:9999/buscarTodasLasVentas", {
        method: "GET"
    })

    .then(respuesta => respuesta.json())

    .then(respuesta => {
        ventas = respuesta;
    })
}

//Cambia la lógica del botón según nos interese actualizar o crear un nuevo producto. Si el nombre del articulo
//existe, rellena los campos con los datos almacenados en la base de datos que le corresponden.
function registrarOActualizar() {

    botonRegistrar.style.display = "none";
    botonActualizar.style.display = "none";
    categoriaRegistro.value = "";
    numExistenciasRegistro.value = "";
    precioRegistro.value = "";
    precioRegistro.disabled = false;
    categoriaRegistro.disabled = false;

    let articulo = articulos.find(a => a.nombreArticulo == nombreRegistro.value);
    
    if(articulo) {
        categoriaRegistro.value = articulo.categoriaArticulo;
        numExistenciasRegistro.value = articulo.existenciasArticulo;
        precioRegistro.value = articulo.precioArticulo;
        botonActualizar.style.display = "block";
        precioRegistro.disabled = true;
        categoriaRegistro.disabled = true;
        
    } else {
        botonRegistrar.style.display = "block";
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
            limpiarFormRegistro();
            articulos.push(jsonData);
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
            limpiarFormRegistro();
            let posicion = articulos.findIndex(a => a.nombreArticulo == nombreRegistro.value);
            articulos[posicion] = jsonData;
        } else {
            alert("No se ha podido actualizar el producto");
        }
    })
}

//Carga los artículos de una misma categoría en un select 
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
        option.value = producto;
        nombreVenta.appendChild(option);
    }
}

//Habilita la elección de artículo en las ventas
function habilitarEleccionArticulo() {
    let categoria = categoriaVenta.value;
    nombreVenta.disabled = false;
    cargarArticulosPorCategoria(categoria);
}

//Asigna el precio asociado al artículo elegido
function asignarPrecio() {
    precioVenta.value = "";
    let articulo = articulos.find(a => a.nombreArticulo == nombreVenta.value);
    precioVenta.value = articulo.precioArticulo;
}

//Registra la venta
function registrarVenta() {
    for(let c of carrito) {
        const jsonString = JSON.stringify(c);

        fetch("http://localhost:9999/crearVenta", {
            method: "POST",
            body: jsonString,
            headers: {
                "Content-Type": "application/json"
            }
        })

        .then(respuesta => respuesta.text())

        .then(respuesta => {
            if(respuesta == "Ok") {
                ventas.push(c);
            } else {
                alert("No se ha podido registrar la venta");
                return;
            }   
        })
    }

    alert("Venta registrada con éxito");
    tbody.innerHTML = "";
    listadoCarrito.style.display = "none";
    carrito = [];
    
}


//Va añadiendo articulos al carrito mostrándolos en una tabla
function mostrarListaVendiendo() {

    const venta = {idVentas: (ventas.length+1), nombreArticulo: nombreVenta.value, unidadesVendidas: unidadesVenta.value, precioVenta: precioVenta.value}
    
    carrito.push(venta);

    listadoCarrito.style.display = "block";

    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    td1.textContent = venta.nombreArticulo;
    tr.appendChild(td1);
    let td2 = document.createElement("td");
    td2.textContent = venta.precioVenta;
    tr.appendChild(td2);
    let td3 = document.createElement("td");
    td3.textContent = venta.unidadesVendidas;
    tr.appendChild(td3);
    let td4 = document.createElement("td");
    td4.textContent = (parseFloat(venta.precioVenta) * parseFloat(venta.unidadesVendidas)).toFixed(2) //Este último método redondea hasta el decimal marcado
    tr.appendChild(td4);

    tbody.appendChild(tr);

    limpiarFormVenta();
}