// 1. Arreglo de productos (ahora se cargará desde la API)
let productos = [];

// 2. Carrito de compras
let carrito = [];

// 3. Variables para el formulario
let currentForm = 'login'; // 'login' o 'register'

// 4. Función para cargar productos desde la API
async function cargarProductos() {
    const loader = document.getElementById("loader");
    loader.style.display = "block"; // Mostrar loader
    
    try {
        // Hacer la petición a la API de Fake Store
        const response = await fetch('https://fakestoreapi.com/products');
        
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        
        const data = await response.json();
        
        // Mapear los datos de la API a nuestro formato
        productos = data.map(producto => ({
            id: producto.id,
            nombre: producto.title,
            precio: producto.price,
            stock: Math.floor(Math.random() * 50) + 10, // Stock aleatorio entre 10 y 60
            imagen: producto.image,
            categoria: producto.category,
            descripcion: producto.description
        }));
        
        mostrarProductos();
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje("Error al cargar los productos. " + error.message, "error");
        
        // Cargar productos de respaldo si la API falla
        productos = [
            { id: 1, nombre: "Guantes de Boxeo Profesionales", precio: 89.99, stock: 15, imagen: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg" },
            { id: 2, nombre: "Vendas para Manos", precio: 12.50, stock: 40, imagen: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg" },
            { id: 3, nombre: "Bucal Personalizado", precio: 24.99, stock: 30, imagen: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg" },
            { id: 4, nombre: "Saco de Boxeo Pesado", precio: 199.99, stock: 8, imagen: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg" },
            { id: 5, nombre: "Protector Bucal Doble Capa", precio: 19.99, stock: 25, imagen: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg" }
        ];
        
        mostrarProductos();
    } finally {
        loader.style.display = "none"; // Ocultar loader
    }
}

// 5. Función para mostrar productos
function mostrarProductos() {
    const contenedorTarjetas = document.getElementById("productos");
    contenedorTarjetas.innerHTML = ""; // Limpiamos el contenedor de tarjetas

    // Generamos las tarjetas de productos
    productos.forEach((producto, index) => {
        const tarjetaProducto = document.createElement("div");
        tarjetaProducto.className = "producto";
        tarjetaProducto.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="info">
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio.toFixed(2)}</p>
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

// 6. Función para cambiar la cantidad
function cambiarCantidad(index, delta) {
    const cantidadInput = document.getElementById(`cantidad-${index}`);
    let cantidad = parseInt(cantidadInput.value) + delta;
    cantidad = Math.max(1, Math.min(productos[index].stock, cantidad));
    cantidadInput.value = cantidad;
}

// 7. Función para agregar productos al carrito
function agregarAlCarrito(index) {
    const producto = productos[index];
    const cantidadInput = document.getElementById(`cantidad-${index}`);
    const cantidad = parseInt(cantidadInput.value);

    if (cantidad > 0 && cantidad <= producto.stock) {
        const itemExistente = carrito.find(item => item.id === producto.id);
        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            carrito.push({ ...producto, cantidad });
        }
        mostrarCarrito();
        mostrarMensaje(`${cantidad} ${producto.nombre}(s) agregado(s) al carrito.`);
    } else {
        mostrarMensaje("Cantidad no válida o stock insuficiente.", "error");
    }
}

// 8. Función para mostrar el carrito
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
                    <p>Precio: $${item.precio.toFixed(2)}</p>
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

// 9. Función para calcular el total del carrito
function calcularTotal() {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

// 10. Función para ajustar la cantidad en el carrito
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

// 11. Función para eliminar productos del carrito
function eliminarDelCarrito(index) {
    const item = carrito[index];
    const producto = productos.find(p => p.id === item.id);
    if (producto) {
        producto.stock += item.cantidad; // Devolvemos el stock al eliminar del carrito
    }
    carrito.splice(index, 1);
    mostrarCarrito();
    mostrarProductos();
}

// 12. Función para procesar la compra
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
            const producto = productos.find(p => p.id === item.id);
            if (producto) {
                producto.stock -= item.cantidad; // Restamos el stock
            }
        });

        carrito = []; // Vaciamos el carrito
        mostrarCarrito(); // Actualizamos la vista del carrito
        mostrarProductos(); // Actualizamos la vista de los productos
    }, 5000); // 5000 milisegundos = 5 segundos
}

// 13. Función para mostrar mensajes en la UI
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

// 14. Funciones para el formulario de login/registro
function toggleLoginMenu() {
    const overlay = document.getElementById("overlay");
    const loginMenu = document.getElementById("loginMenu");
    
    if (loginMenu.classList.contains("active")) {
        loginMenu.classList.remove("active");
        overlay.style.display = "none";
    } else {
        loginMenu.classList.add("active");
        overlay.style.display = "block";
    }
}

function toggleForms() {
    const loginForm = document.getElementById("loginFormContainer");
    const registerForm = document.getElementById("registerFormContainer");
    
    if (currentForm === 'login') {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        currentForm = 'register';
    } else {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        currentForm = 'login';
    }
}

// 15. Validación del formulario de registro
function validarRegistro() {
    let isValid = true;
    
    // Validar nombre (solo letras y espacios)
    const name = document.getElementById("registerName").value.trim();
    const nameError = document.getElementById("registerNameError");
    const nameRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$/;
    
    if (!name) {
        nameError.textContent = "El nombre es requerido";
        nameError.style.display = "block";
        isValid = false;
    } else if (!nameRegex.test(name)) {
        nameError.textContent = "El nombre solo puede contener letras y espacios";
        nameError.style.display = "block";
        isValid = false;
    } else {
        nameError.style.display = "none";
    }
    
    // Validar email
    const email = document.getElementById("registerEmail").value.trim();
    const emailError = document.getElementById("registerEmailError");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        emailError.textContent = "El correo electrónico es requerido";
        emailError.style.display = "block";
        isValid = false;
    } else if (!emailRegex.test(email)) {
        emailError.textContent = "Ingrese un correo electrónico válido";
        emailError.style.display = "block";
        isValid = false;
    } else {
        emailError.style.display = "none";
    }
    
    // Validar contraseña (mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 caracter especial)
    const password = document.getElementById("registerPassword").value;
    const passwordError = document.getElementById("registerPasswordError");
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!password) {
        passwordError.textContent = "La contraseña es requerida";
        passwordError.style.display = "block";
        isValid = false;
    } else if (!passwordRegex.test(password)) {
        passwordError.textContent = "La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales";
        passwordError.style.display = "block";
        isValid = false;
    } else {
        passwordError.style.display = "none";
    }
    
    // Validar confirmación de contraseña
    const confirmPassword = document.getElementById("registerConfirmPassword").value;
    const confirmPasswordError = document.getElementById("registerConfirmPasswordError");
    
    if (!confirmPassword) {
        confirmPasswordError.textContent = "Confirme su contraseña";
        confirmPasswordError.style.display = "block";
        isValid = false;
    } else if (password !== confirmPassword) {
        confirmPasswordError.textContent = "Las contraseñas no coinciden";
        confirmPasswordError.style.display = "block";
        isValid = false;
    } else {
        confirmPasswordError.style.display = "none";
    }
    
    return isValid;
}

// 16. Validación del formulario de login
function validarLogin() {
    let isValid = true;
    
    // Validar email
    const email = document.getElementById("loginEmail").value.trim();
    const emailError = document.getElementById("loginEmailError");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        emailError.textContent = "El correo electrónico es requerido";
        emailError.style.display = "block";
        isValid = false;
    } else if (!emailRegex.test(email)) {
        emailError.textContent = "Ingrese un correo electrónico válido";
        emailError.style.display = "block";
        isValid = false;
    } else {
        emailError.style.display = "none";
    }
    
    // Validar contraseña
    const password = document.getElementById("loginPassword").value;
    const passwordError = document.getElementById("loginPasswordError");
    
    if (!password) {
        passwordError.textContent = "La contraseña es requerida";
        passwordError.style.display = "block";
        isValid = false;
    } else if (password.length < 8) {
        passwordError.textContent = "La contraseña debe tener al menos 8 caracteres";
        passwordError.style.display = "block";
        isValid = false;
    } else {
        passwordError.style.display = "none";
    }
    
    return isValid;
}

// Función para crear el loader del formulario (actualizada)
function crearFormLoader(texto) {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const loaderContainer = document.createElement("div");
    loaderContainer.className = "form-loader";
    loaderContainer.innerHTML = `
        <div class="form-loader-container">
            <div class="form-loader-box" style="border-color: ${isDarkMode ? 'white' : '#6A1B9A'}"></div>
            <div class="form-loader-hill" style="border-left-color: ${isDarkMode ? 'white' : '#9C27B0'}"></div>
        </div>
        <p style="color: ${isDarkMode ? 'white' : '#6A1B9A'}">${texto}</p>
    `;
    return loaderContainer;
}

// Función para restaurar el formulario después del loader
function restaurarFormulario(tipo) {
    const container = document.getElementById(`${tipo}FormContainer`);
    container.innerHTML = `
        <h2>${tipo === 'login' ? 'Iniciar Sesión' : 'Registro de Usuario'}</h2>
        <form id="${tipo}Form">
            ${tipo === 'login' ? `
                <div class="form-group">
                    <label for="loginEmail">Correo electrónico</label>
                    <input type="email" id="loginEmail" required>
                    <div class="error" id="loginEmailError"></div>
                </div>
                <div class="form-group">
                    <label for="loginPassword">Contraseña</label>
                    <input type="password" id="loginPassword" required minlength="8">
                    <div class="error" id="loginPasswordError"></div>
                </div>
            ` : `
                <div class="form-group">
                    <label for="registerName">Nombre completo</label>
                    <input type="text" id="registerName" required pattern="[A-Za-záéíóúÁÉÍÓÚñÑ ]+">
                    <div class="error" id="registerNameError"></div>
                </div>
                <div class="form-group">
                    <label for="registerEmail">Correo electrónico</label>
                    <input type="email" id="registerEmail" required>
                    <div class="error" id="registerEmailError"></div>
                </div>
                <div class="form-group">
                    <label for="registerPassword">Contraseña</label>
                    <input type="password" id="registerPassword" required minlength="8">
                    <div class="error" id="registerPasswordError"></div>
                </div>
                <div class="form-group">
                    <label for="registerConfirmPassword">Confirmar contraseña</label>
                    <input type="password" id="registerConfirmPassword" required>
                    <div class="error" id="registerConfirmPasswordError"></div>
                </div>
            `}
            <div class="form-actions">
                <button type="submit">${tipo === 'login' ? 'Iniciar Sesión' : 'Registrarse'}</button>
            </div>
        </form>
        <div class="form-toggle">
            ${tipo === 'login' ? 
                '¿No tienes cuenta? <button id="showRegister">Regístrate aquí</button>' : 
                '¿Ya tienes cuenta? <button id="showLogin">Inicia sesión aquí</button>'}
        </div>
    `;
    
    // Reasignar eventos
    if (tipo === 'login') {
        document.getElementById("loginForm").addEventListener("submit", procesarLogin);
        document.getElementById("showRegister").addEventListener("click", toggleForms);
    } else {
        document.getElementById("registerForm").addEventListener("submit", procesarRegistro);
        document.getElementById("showLogin").addEventListener("click", toggleForms);
    }
}

// 17. Función para procesar el registro (actualizada)
function procesarRegistro(event) {
    event.preventDefault();
    
    if (validarRegistro()) {
        const registerFormContainer = document.getElementById("registerFormContainer");
        const loader = crearFormLoader("Procesando registro...");
        
        // Limpiar y mostrar loader
        registerFormContainer.innerHTML = '';
        registerFormContainer.appendChild(loader);
        
        setTimeout(() => {
            // Restaurar formulario después de 10 segundos
            restaurarFormulario('register');
            toggleForms(); // Cambia a login
            mostrarMensaje("¡Registro exitoso! Ahora puedes iniciar sesión.");
        }, 10000); // 10 segundos
    }
}

// 18. Función para procesar el login (actualizada)
function procesarLogin(event) {
    event.preventDefault();
    
    if (validarLogin()) {
        const loginFormContainer = document.getElementById("loginFormContainer");
        const loader = crearFormLoader("Iniciando sesión...");
        
        // Limpiar y mostrar loader
        loginFormContainer.innerHTML = '';
        loginFormContainer.appendChild(loader);
        
        setTimeout(() => {
            // Restaurar formulario después de 10 segundos
            restaurarFormulario('login');
            toggleLoginMenu();
            mostrarMensaje("¡Inicio de sesión exitoso!");
        }, 10000); // 10 segundos
    }
}

// 19. Inicialización de eventos
function initEventListeners() {
    // Botón de login
    document.getElementById("loginBtn").addEventListener("click", toggleLoginMenu);
    
    // Botón para cerrar el menú
    document.getElementById("closeBtn").addEventListener("click", toggleLoginMenu);
    document.getElementById("overlay").addEventListener("click", toggleLoginMenu);
    
    // Botones para alternar entre login y registro
    document.getElementById("showRegister").addEventListener("click", toggleForms);
    document.getElementById("showLogin").addEventListener("click", toggleForms);
    
    // Formularios
    document.getElementById("registerForm").addEventListener("submit", procesarRegistro);
    document.getElementById("loginForm").addEventListener("submit", procesarLogin);
}

// 20. Función para alternar modo oscuro/claro
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateThemeButton();
    updateLoaderColors();
}

// 21. Función para actualizar el ícono del botón
function updateThemeButton() {
    const themeButton = document.getElementById('themeToggle');
    if (document.body.classList.contains('dark-mode')) {
        themeButton.innerHTML = '<i class="fas fa-sun"></i>';
        themeButton.title = 'Modo claro';
    } else {
        themeButton.innerHTML = '<i class="fas fa-moon"></i>';
        themeButton.title = 'Modo oscuro';
    }
}

// 22. Crear botón de tema
function createThemeButton() {
    const themeButton = document.createElement('button');
    themeButton.id = 'themeToggle';
    themeButton.className = 'theme-toggle';
    themeButton.onclick = toggleDarkMode;
    document.body.appendChild(themeButton);
    updateThemeButton();
}

// 23. Verificar preferencia guardada
function checkSavedTheme() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        document.body.classList.add('dark-mode');
    }
    updateLoaderColors();
}

// 24. Función para actualizar colores del loader
function updateLoaderColors() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const mainLoaderBox = document.getElementById('box');
    const mainLoaderHill = document.getElementById('hill');
    const formLoadersBox = document.querySelectorAll('.form-loader-box');
    const formLoadersHill = document.querySelectorAll('.form-loader-hill');
    
    if (isDarkMode) {
        if (mainLoaderBox) mainLoaderBox.style.borderColor = 'white';
        if (mainLoaderHill) mainLoaderHill.style.borderLeftColor = 'white';
        formLoadersBox.forEach(box => box.style.borderColor = 'white');
        formLoadersHill.forEach(hill => hill.style.borderLeftColor = 'white');
    } else {
        if (mainLoaderBox) mainLoaderBox.style.borderColor = '#6A1B9A';
        if (mainLoaderHill) mainLoaderHill.style.borderLeftColor = '#9C27B0';
        formLoadersBox.forEach(box => box.style.borderColor = '#6A1B9A');
        formLoadersHill.forEach(hill => hill.style.borderLeftColor = '#9C27B0');
    }
}

// 25. Inicializar la aplicación
async function init() {
    await cargarProductos();
    initEventListeners();
    createThemeButton();
    checkSavedTheme();
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", init);