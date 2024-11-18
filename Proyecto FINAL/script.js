async function obtenerAlojamientosDestacados() {
    try {
        const response = await fetch("http://localhost:5277/api/Alojamientos/destacados");
        const alojamientos = await response.json();

        const contenedorCarrusel = document.querySelector(".carrusel-track");
        contenedorCarrusel.innerHTML = "";

        alojamientos.forEach((alojamiento, index) => {
            const alojamientoDiv = document.createElement("div");
            alojamientoDiv.classList.add("contenedor-alojamiento");

            alojamientoDiv.innerHTML = `
                <div class="contenedor-Imagen">
                    <img src="${alojamiento.url_imagen}" alt="${alojamiento.nombre}">
                    <div class="precio">
                        <p>$${alojamiento.precio}/noche</p>
                    </div>
                </div>
                <div class="ubicacion-Alojamiento">
                    <p>${alojamiento.ubicacion}</p>
                </div>
                <div class="Habitaciones">
                    <p>${alojamiento.habitaciones_disponibles} Habitaciones</p>
                </div>
                <button class="Mas-Detalles">Más detalles</button>
            `;
            contenedorCarrusel.appendChild(alojamientoDiv);

            // Si es el primer alojamiento, añade una funcionalidad especial al botón "Más detalles"
            if (index === 0) {
                const botonMasDetalles = alojamientoDiv.querySelector(".Mas-Detalles");
                botonMasDetalles.addEventListener("click", () => {
                    window.location.href = "detalles.html";
                });
            }
        });
    } catch (error) {
        console.error("Error al obtener alojamientos:", error);
    }
}

obtenerAlojamientosDestacados();


// Cargar datos desde la API y llenar las opciones de filtros dinámicamente
function cargarFiltros() {
    fetch('http://localhost:5277/api/Alojamientos')
        .then(response => response.json())
        .then(data => {
            cargarUbicaciones(data);
            cargarRangoPrecios(data);
            cargarHabitaciones(data);
            configurarBusqueda(data);
        })
        .catch(error => {
            console.error('Error al cargar datos de alojamiento:', error);
        });
}

function cargarUbicaciones(data) {
    const locationSelect = document.getElementById('location');
    const provincias = [...new Set(data.map(alojamiento => alojamiento.provincia))];
    
    provincias.forEach(provincia => {
        const option = document.createElement('option');
        option.value = provincia;
        option.textContent = provincia;
        locationSelect.appendChild(option);
    });
}

function cargarRangoPrecios(data) {
    const priceSelect = document.getElementById('price-range');
    const precios = data.map(alojamiento => alojamiento.precio);
    const minPrecio = Math.min(...precios);
    const maxPrecio = Math.max(...precios);
    
    const intervalo = 50;
    for (let i = minPrecio; i <= maxPrecio; i += intervalo) {
        const option = document.createElement('option');
        option.value = `${i}-${i + intervalo - 1}`;
        option.textContent = `$${i} - $${i + intervalo - 1}`;
        priceSelect.appendChild(option);
    }
    
    const optionPlus = document.createElement('option');
    optionPlus.value = `${maxPrecio}+`;
    optionPlus.textContent = `$${maxPrecio}+`;
    priceSelect.appendChild(optionPlus);
}

function cargarHabitaciones(data) {
    const roomsSelect = document.getElementById('rooms');
    const habitaciones = [...new Set(data.map(alojamiento => alojamiento.habitaciones_disponibles))].sort((a, b) => a - b);

    habitaciones.forEach(num => {
        const option = document.createElement('option');
        option.value = num;
        option.textContent = num;
        roomsSelect.appendChild(option);
    });
}

// Configurar el formulario de búsqueda
function configurarBusqueda(data) {
    const form = document.getElementById('search-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        filtrarAlojamientos(data);
    });
}

// Filtrar y mostrar alojamientos según los filtros seleccionados
function filtrarAlojamientos(data) {
    const location = document.getElementById('location').value;
    const priceRange = document.getElementById('price-range').value;
    const rooms = document.getElementById('rooms').value;

    const [minPrice, maxPrice] = priceRange.includes('-')
        ? priceRange.split('-').map(Number)
        : [Number(priceRange.replace('+', '')), Infinity];

    const alojamientosFiltrados = data.filter(alojamiento => {
        const enRango = alojamiento.precio >= minPrice && alojamiento.precio <= maxPrice;
        const coincideUbicacion = !location || alojamiento.provincia === location;
        const coincideHabitaciones = !rooms || alojamiento.habitaciones_disponibles === Number(rooms);
        return enRango && coincideUbicacion && coincideHabitaciones;
    });

    mostrarResultados(alojamientosFiltrados);
}

// Mostrar los resultados en el contenedor HTML
function mostrarResultados(alojamientos) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // Limpiar resultados anteriores

    if (alojamientos.length === 0) {
        resultsContainer.textContent = 'No se encontraron alojamientos que coincidan con los filtros.';
        return;
    }

    alojamientos.forEach(alojamiento => {
        const alojamientoCard = document.createElement('div');
        alojamientoCard.classList.add('result-card');
        
        alojamientoCard.innerHTML = `
            <img src="${alojamiento.url_imagen}" alt="${alojamiento.nombre}">
            <h3>${alojamiento.nombre}</h3>
            <p><strong>Ubicación:</strong> ${alojamiento.ubicacion}</p>
            <p><strong>Tipo:</strong> ${alojamiento.tipo_alojamiento}</p>
            <p><strong>Precio:</strong> $${alojamiento.precio}</p>
            <p><strong>Habitaciones disponibles:</strong> ${alojamiento.habitaciones_disponibles}</p>
            <p><strong>Descripción:</strong> ${alojamiento.descripcion_corta}</p>
        `;

        resultsContainer.appendChild(alojamientoCard);
    });
}

// Llama a la función para cargar los filtros y configuraciones al cargar la página
window.onload = cargarFiltros;



// Función para verificar si el usuario está logueado
async function checkLoginStatus() {
    const token = localStorage.getItem('userToken');
    const myReservationsLink = document.getElementById('myReservations');
    const btnLogin = document.querySelector('.navbar-button');
    
    if (token) {
        try {
            const response = await fetch(`http://localhost:5277/api/alojamientos/validate?token=${token}`);
            if (response.ok) {
                const data = await response.json();
                // Mostrar "Mis reservas" y cambiar el botón a "Cerrar sesión"
                myReservationsLink.style.display = 'block';
                btnLogin.innerHTML = `<a href="#" onclick="logout()">Cerrar sesión</a>`;
            } else {
                localStorage.removeItem('userToken');
                myReservationsLink.style.display = 'none';
            }
        } catch (error) {
            console.error('Error:', error);
            myReservationsLink.style.display = 'none';
        }
    } else {
        // Si no hay token, ocultar "Mis reservas"
        myReservationsLink.style.display = 'none';
    }
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('userToken');
    console.log("Token eliminado");
    window.location.href = 'PagInicio.html';
}

// Llamar a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', checkLoginStatus);


// Escuchar el evento cuando la página se está cerrando o recargando
window.addEventListener('beforeunload', function() {
    localStorage.removeItem('userToken');  // Eliminar el token cuando se cierra o recarga la página
});



