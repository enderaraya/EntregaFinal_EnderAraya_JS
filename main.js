let productos = [];
let carrito = [];

function guardarProductosEnStorage() {
    localStorage.setItem("productos", JSON.stringify(productos));
}

function guardarCarritoEnStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function buscar() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let resultadoElement = document.getElementById("resultado");
    resultadoElement.innerHTML = "";

    let resultados = productos.filter(function (producto) {
        return producto.nombre.toLowerCase().includes(input) || producto.categoria.toLowerCase().includes(input);
    });

    resultados.forEach(function (producto) {
        let li = document.createElement("li");
        li.textContent = `${producto.nombre} - ${producto.categoria} - Precio: $${producto.precio.toFixed(2)}`;
    
        let botonAgregar = document.createElement("button");
        botonAgregar.textContent = "Agregar al carrito";
        botonAgregar.addEventListener("click", function() {
            agregarAlCarrito(producto.id);
        });
        
        li.appendChild(botonAgregar);
        
        resultadoElement.appendChild(li);
    });
}

document.getElementById("searchInput").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        buscar();
    }
});

function agregarAlCarrito(id) {
    const producto = productos.find(producto => producto.id === id);
    if (producto) {
        carrito.push(producto);
        guardarCarritoEnStorage();
        mostrarCarrito();
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Producto agregado al carrito",
            showConfirmButton: false,
            timer: 1250
            });
    }
}

function mostrarCarrito() {
    const carritoElement = document.getElementById("carrito");
    carritoElement.innerHTML = "";
    let total = 0;
    carrito.forEach(producto => {
        const li = document.createElement("li");
        li.textContent = `${producto.nombre} - ${producto.categoria} - Precio: $${producto.precio.toFixed(2)}`;
        carritoElement.appendChild(li);
        total += producto.precio;
    });

    const totalElement = document.createElement("p");
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
    carritoElement.appendChild(totalElement);
}

function cargarProductos() {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            productos = data;
            guardarProductosEnStorage();
        })
        .catch(error => console.error('Error al cargar los productos:', error));
}

function cargarCarrito() {
    const carritoEnStorage = localStorage.getItem("carrito");
    if (carritoEnStorage) {
        carrito = JSON.parse(carritoEnStorage);
        mostrarCarrito();
    }
}

function agregarNuevoProducto() {

    let nuevoNombre = prompt("Ingrese el nombre del nuevo producto:");
    let nuevaCategoria = prompt("Ingrese la categoría del nuevo producto:");
    let nuevoPrecio = parseFloat(prompt("Ingrese el precio del nuevo producto:"));


    if (isNaN(nuevoPrecio)) {
        Swal.fire({
            icon: "error",
            title: "Precio no valido",
            text: "Por favor ingrese un precio valido",
            });
        return;
    }


    let nuevoProducto = {
        id: productos.length + 1,
        nombre: nuevoNombre,
        categoria: nuevaCategoria,
        precio: nuevoPrecio
    };


    productos.push(nuevoProducto);


    guardarProductosEnStorage();


    buscar();
}

function eliminarProducto() {

    let idEliminar = parseInt(prompt("Ingrese el ID del producto que desea eliminar:"));


    if (isNaN(idEliminar)) {
        
        Swal.fire({
            icon: "error",
            title: "ID no encontrado",
            text: "Por favor ingrese un ID valido",
            });
        return;
    }


    let index = productos.findIndex(producto => producto.id === idEliminar);


    if (index !== -1) {

        productos.splice(index, 1);

        guardarProductosEnStorage();
        
        buscar();
    } else {
        Swal.fire({
            icon: "error",
            title: "Producto no encontrado",
            text: "Por favor ingrese un ID valido",
            });
    }
}

function vaciarCarrito() {
    Swal.fire({
        title: "Quieres borrar carrito?",
        text: "Tu carrito será vaciado",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si"
        }).then((result) => {
            if (result.isConfirmed) {
                carrito = [];
                guardarCarritoEnStorage();
                
                mostrarCarrito();
            Swal.fire({
                title: "Carrito Vaciado",
                icon: "success"
                
            });
            }
        });
    
}

window.addEventListener("load", function () {
    cargarProductos();
    cargarCarrito();
});



