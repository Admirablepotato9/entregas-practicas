// 1. Arreglo de productos
const productos = [
    { nombre: "Laptop", precio: 1200, stock: 10 },
    { nombre: "Smartphone", precio: 800, stock: 15 },
    { nombre: "Tablet", precio: 500, stock: 20 },
    { nombre: "Auriculares", precio: 100, stock: 30 },
];

// 2. Carrito de compras
let carrito = [];

// 3. Función para mostrar productos
function mostrarProductos() {
    const contenedorTarjetas = document.querySelector(".productos");
    contenedorTarjetas.innerHTML = ""; // Limpiamos el contenedor de tarjetas

    // Generamos las tarjetas de productos
    productos.forEach((producto, index) => {
        const tarjetaProducto = document.createElement("div");
        tarjetaProducto.className = "producto";
        tarjetaProducto.innerHTML = `
            <img src="assets/images/${producto.nombre.toLowerCase()}.jpg" alt="${producto.nombre}">
            <div class="info">
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
                <p>Stock: ${producto.stock}</p>
                <div class="cantidad">
                    <button onclick="cambiarCantidad(${index}, -1)">-</button>
                    <input type="number" id="cantidad-${index}" min="1" max="${producto.stock}" value="1">
                    <button onclick="cambiarCantidad(${index}, 1)">+</button>
                </div>
                <button onclick="agregarAlCarrito(${index})">Agregar al Carrito</button>
            </div>
        `;
        contenedorTarjetas.appendChild(tarjetaProducto);
    });
}

// 4. Función para cambiar la cantidad
function cambiarCantidad(index, delta) {
    const cantidadInput = document.getElementById(`cantidad-${index}`);
    let cantidad = parseInt(cantidadInput.value) + delta;
    cantidad = Math.max(1, Math.min(productos[index].stock, cantidad));
    cantidadInput.value = cantidad;
}

// 5. Función para agregar productos al carrito
function agregarAlCarrito(index) {
    const producto = productos[index];
    const cantidadInput = document.getElementById(`cantidad-${index}`);
    const cantidad = parseInt(cantidadInput.value);

    if (cantidad > 0 && cantidad <= producto.stock) {
        const itemExistente = carrito.find(item => item.nombre === producto.nombre);
        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            carrito.push({ ...producto, cantidad });
        }
        mostrarCarrito();
        mostrarProductos();
        mostrarMensaje(`${cantidad} ${producto.nombre}(s) agregado(s) al carrito.`);
    } else {
        mostrarMensaje("Cantidad no válida o stock insuficiente.", "error");
    }
}

// 6. Función para mostrar el carrito
function mostrarCarrito() {
    const contenedorCarrito = document.getElementById("carrito");
    contenedorCarrito.innerHTML = "<h2>Carrito de Compras</h2>";
    if (carrito.length === 0) {
        contenedorCarrito.innerHTML += "<p>El carrito está vacío.</p>";
    } else {
        carrito.forEach((item, index) => {
            contenedorCarrito.innerHTML += `
                <div class="item">
                    <h3>${item.nombre}</h3>
                    <p>Precio: $${item.precio}</p>
                    <div class="cantidad">
                        <button onclick="ajustarCantidadCarrito(${index}, -1)">-</button>
                        <input type="number" id="cantidad-carrito-${index}" value="${item.cantidad}" min="1" max="${item.stock}">
                        <button onclick="ajustarCantidadCarrito(${index}, 1)">+</button>
                    </div>
                    <p>Total: $${(item.precio * item.cantidad).toFixed(2)}</p>
                    <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
                </div>
            `;
        });

        const total = calcularTotal();
        const descuento = total > 100 ? total * 0.1 : 0; // Calculamos el descuento
        const totalConDescuento = total - descuento;

        contenedorCarrito.innerHTML += `
            <p class="total">Subtotal: $${total.toFixed(2)}</p>
            ${descuento > 0 ? `<p class="descuento">Descuento (10%): -$${descuento.toFixed(2)}</p>` : ''}
            <p class="total">Total a pagar: $${totalConDescuento.toFixed(2)}</p>
        `;
    }
}

// 7. Función para calcular el total del carrito
function calcularTotal() {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

// 8. Función para ajustar la cantidad en el carrito
function ajustarCantidadCarrito(index, delta) {
    const item = carrito[index];
    const nuevaCantidad = item.cantidad + delta;

    if (nuevaCantidad > 0 && nuevaCantidad <= item.stock) {
        item.cantidad = nuevaCantidad;
        mostrarCarrito();
    } else if (nuevaCantidad <= 0) {
        eliminarDelCarrito(index);
    } else {
        mostrarMensaje("No hay suficiente stock disponible.", "error");
    }
}

// 9. Función para eliminar productos del carrito
function eliminarDelCarrito(index) {
    const item = carrito[index];
    const producto = productos.find(p => p.nombre === item.nombre);
    producto.stock += item.cantidad; // Devolvemos el stock al eliminar del carrito
    carrito.splice(index, 1);
    mostrarCarrito();
    mostrarProductos();
}

// 10. Función para procesar la compra
function procesarCompra() {
    if (carrito.length === 0) {
        mostrarMensaje("El carrito está vacío.", "error");
        return;
    }

    const loader = document.getElementById("loader");
    loader.style.display = "block"; // Mostrar el loader

    setTimeout(() => {
        loader.style.display = "none"; // Ocultar el loader después de 5 segundos

        const total = calcularTotal();
        const descuento = total > 100 ? total * 0.1 : 0; // Calculamos el descuento
        const totalConDescuento = total - descuento;

        mostrarMensaje(`Compra realizada con éxito! Total a pagar: $${totalConDescuento.toFixed(2)}`);

        // Actualizamos el stock después de procesar la compra
        carrito.forEach(item => {
            const producto = productos.find(p => p.nombre === item.nombre);
            if (producto) {
                producto.stock -= item.cantidad; // Restamos el stock
            }
        });

        carrito = []; // Vaciamos el carrito
        mostrarCarrito(); // Actualizamos la vista del carrito
        mostrarProductos(); // Actualizamos la vista de los productos
    }, 5000); // 5000 milisegundos = 5 segundos
}

// 11. Función para mostrar mensajes en la UI
function mostrarMensaje(mensaje, tipo = "info") {
    const contenedorMensaje = document.getElementById("mensaje");
    if (!contenedorMensaje) {
        console.error("El contenedor de mensajes no existe en el DOM.");
        return;
    }

    contenedorMensaje.textContent = mensaje;
    contenedorMensaje.style.backgroundColor = tipo === "error" ? "#ff6b6b" : "#CE93D8";
    contenedorMensaje.style.display = "block"; // Mostrar el mensaje

    setTimeout(() => {
        contenedorMensaje.textContent = "";
        contenedorMensaje.style.display = "none"; // Ocultar el mensaje después de 5 segundos
    }, 5000); // Cambiamos de 3000 a 5000 milisegundos (5 segundos)
}

// Inicializar la tienda
mostrarProductos();