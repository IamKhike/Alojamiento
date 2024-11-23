// Verificar si el usuario está autenticado
async function isAuthenticated() {
    const userId = localStorage.getItem("usuario"); // Leer el ID del usuario desde localStorage
    if (!userId) return false;

    try {
        const response = await fetch(`http://localhost:5277/api/User/validate/${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        return response.ok;
    } catch (error) {
        console.error("Error al verificar la autenticación:", error);
        return false;
    }
}

// Función para requerir autenticación
async function requireAuth() {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        alert("Debes iniciar sesión para acceder a esta página.");
        window.location.href = "InicioSesion.html";
        return false;
    }
    return true;
}

// Función para cerrar sesión
async function logout() {
    try {
        // Eliminar el ID del usuario de localStorage
        localStorage.removeItem("usuario");
        alert("Sesión cerrada exitosamente.");
        window.location.href = "InicioSesion.html";
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        alert("Hubo un problema al cerrar sesión.");
    }
}

// Configurar la barra de navegación
async function configureNavbar() {
    const reservationsLink = document.getElementById("myReservations");
    const userDisplay = document.getElementById("user-display");
    const loginButton = document.querySelector(".navbar-button");

    const userId = localStorage.getItem("usuario");

    if (!userId) {
        // Si no hay usuario autenticado, muestra opciones de inicio de sesión
        if (reservationsLink) reservationsLink.style.display = "none";
        if (userDisplay) userDisplay.textContent = "";
        if (loginButton) {
            loginButton.innerHTML = `<a href="InicioSesion.html">Iniciar sesión</a>`;
        }
        return;
    }

    try {
        const response = await fetch(`http://localhost:5277/api/User/validate/${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            const data = await response.json();
            // Mostrar opciones de usuario autenticado
            if (reservationsLink) reservationsLink.style.display = "inline";
            if (userDisplay) userDisplay.textContent = `Bienvenido, ${data.usuario}`;
            if (loginButton) {
                loginButton.innerHTML = `<a href="#" id="logoutButton">Cerrar sesión</a>`;
                document.getElementById("logoutButton").addEventListener("click", logout);
            }
        } else {
            throw new Error("No autenticado");
        }
    } catch (error) {
        console.error("Error al configurar la barra de navegación:", error);
        // Mostrar opciones de usuario no autenticado
        if (reservationsLink) reservationsLink.style.display = "none";
        if (userDisplay) userDisplay.textContent = "";
        if (loginButton) {
            loginButton.innerHTML = `<a href="InicioSesion.html">Iniciar sesión</a>`;
        }
    }
}

// Inicializar protección de rutas y configuración de barra de navegación
async function init() {
    const currentPath = window.location.pathname;
    const protectedPaths = [
        "/ruta-protegida-1.html",
        "/ruta-protegida-2.html",
        "/ruta-protegida-3.html",
    ]; // Añade las rutas protegidas aquí

    if (protectedPaths.includes(currentPath)) {
        if (!(await requireAuth())) return; // Redirigir si no está autenticado
    }
    configureNavbar(); // Configurar barra de navegación
}

// Ejecutar al cargar el documento
document.addEventListener("DOMContentLoaded", init);
