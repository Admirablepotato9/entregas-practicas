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
    const contenedorProductos = document.getElementById("productos");
    contenedorProductos.innerHTML = "<h2>Productos Disponibles</h2>";
    productos.forEach((producto, index) => {
        contenedorProductos.innerHTML += `
            <div class="producto">
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
                <p>Stock: ${producto.stock}</p>
                <button onclick="agregarAlCarrito(${index})">Agregar al Carrito</button>
            </div>
        `;
    });
}

// 4. Función para agregar productos al carrito
function agregarAlCarrito(index) {
    const producto = productos[index];
    const cantidad = parseInt(prompt(`¿Cuántas unidades de ${producto.nombre} deseas agregar?`));

    if (cantidad > 0 && cantidad <= producto.stock) {
        carrito.push({ ...producto, cantidad });
        producto.stock -= cantidad;
        mostrarCarrito();
        mostrarProductos();
        alert(`${cantidad} ${producto.nombre}(s) agregado(s) al carrito.`);
    } else {
        alert("Cantidad no válida o stock insuficiente.");
    }
}

// 5. Función para mostrar el carrito
function mostrarCarrito() {
    const contenedorCarrito = document.getElementById("carrito");
    contenedorCarrito.innerHTML = "<h2>Carrito de Compras</h2>";
    if (carrito.length === 0) {
        contenedorCarrito.innerHTML += "<p>El carrito está vacío.</p>";
    } else {
        carrito.forEach((item, index) => {
            contenedorCarrito.innerHTML += `
                <div class="producto">
                    <h3>${item.nombre}</h3>
                    <p>Precio: $${item.precio}</p>
                    <p>Cantidad: ${item.cantidad}</p>
                    <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
                </div>
            `;
        });
        contenedorCarrito.innerHTML += `<p>Total: $${calcularTotal()}</p>`;
    }
}

// 6. Función para calcular el total del carrito
function calcularTotal() {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

// 7. Función para aplicar descuentos
function aplicarDescuento(total) {
    return total > 100 ? total * 0.9 : total;
}

// 8. Función para eliminar productos del carrito
function eliminarDelCarrito(index) {
    const item = carrito[index];
    const producto = productos.find(p => p.nombre === item.nombre);
    producto.stock += item.cantidad;
    carrito.splice(index, 1);
    mostrarCarrito();
    mostrarProductos();
}

// 9. Función para procesar la compra
function procesarCompra() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    const total = calcularTotal();
    const totalConDescuento = aplicarDescuento(total);

    console.log("Procesando compra...");
    setTimeout(() => {
        console.log(`Total a pagar: $${totalConDescuento}`);
        alert(`Total a pagar: $${totalConDescuento}`);
        carrito = [];
        mostrarCarrito();
        mostrarProductos();
    }, 3000);
}

// Inicializar la tienda
mostrarProductos();