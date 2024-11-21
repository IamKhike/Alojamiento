// Función para decodificar el token JWT
function decodeToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
            .join('')
    );
    return JSON.parse(jsonPayload);
}

// Función para verificar si el token ha expirado
function isTokenExpired(token) {
    try {
        const payload = decodeToken(token);
        const expirationTime = payload.exp * 1000; // Convertir a milisegundos
        return Date.now() > expirationTime;
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return true; // Considera expirado si no se puede decodificar
    }
}

// Función para verificar si el usuario está logueado
async function checkLoginStatus() {
    const token = localStorage.getItem('userToken');

    if (!token || isTokenExpired(token)) {
        console.log("Usuario no autenticado o token expirado.");
        // Si no hay token, puedes mostrar un estado predeterminado
        displayGuestUI();
        return false;
    }

    try {
        // Validar el token con el servidor
        const response = await fetch('http://localhost:5277/api/User/validate', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Token no válido en el servidor');
        }

        const data = await response.json();
        console.log('Usuario autenticado:', data);
        displayUserUI(data); // Muestra la interfaz personalizada para el usuario
        return true;
    } catch (error) {
        console.error('Error al validar el token:', error);
        displayGuestUI(); // Muestra la interfaz para usuarios no autenticados
        return false;
    }
}

// Función para mostrar la interfaz para un usuario autenticado
function displayUserUI(data) {
    const userDisplay = document.getElementById('user-display');
    if (userDisplay) {
        userDisplay.textContent = `Bienvenido, ${data.email}`;
    }
    const myReservations = document.getElementById('myReservations');
    if (myReservations) {
        myReservations.style.display = 'block';
    }
}

// Función para mostrar la interfaz para usuarios no autenticados
function displayGuestUI() {
    const userDisplay = document.getElementById('user-display');
    if (userDisplay) {
        userDisplay.textContent = 'Bienvenido, Invitado';
    }
    const myReservations = document.getElementById('myReservations');
    if (myReservations) {
        myReservations.style.display = 'none';
    }
}

// Llama a esta función en cada página para verificar si el usuario está autenticado
document.addEventListener('DOMContentLoaded', checkLoginStatus);
