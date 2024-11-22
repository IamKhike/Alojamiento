// auth.js

// Verificar si el usuario está autenticado
function isAuthenticated() {
    const token = localStorage.getItem('userToken');
    return !!token;
}

// Redirigir si no está autenticado
function requireAuth() {
    if (!isAuthenticated()) {
        alert("Debes iniciar sesión para acceder a esta página.");
        window.location.href = "InicioSesion.html";
    }
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    window.location.href = "InicioSesion.html";
}

// Configurar navbar dinámico
function configureNavbar() {
    const token = localStorage.getItem('userToken');
    const userName = localStorage.getItem('userName');
    const reservationsLink = document.getElementById('myReservations');
    const userDisplay = document.getElementById('user-display');
    const loginButton = document.querySelector('.navbar-button');

    if (token) {
        reservationsLink.style.display = 'inline';
        userDisplay.textContent = `Bienvenido, ${userName}`;
        loginButton.innerHTML = `<a href="#" id="logoutButton">Cerrar sesión</a>`;
        document.getElementById('logoutButton').addEventListener('click', logout);
    } else {
        reservationsLink.style.display = 'none';
        loginButton.innerHTML = `<a href="InicioSesion.html">Iniciar sesión</a>`;
    }
}

// Llamar configuración en cada página
document.addEventListener("DOMContentLoaded", configureNavbar);
