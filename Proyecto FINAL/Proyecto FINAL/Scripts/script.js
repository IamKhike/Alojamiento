async function obtenerAlojamientosDestacados() {
    try {
        const response = await fetch("http://localhost:5277/api/Alojamientos/destacados");
        const alojamientos = await response.json();

        const contenedorCarrusel = document.querySelector(".splide__list");
        contenedorCarrusel.innerHTML = ""; // Limpiar contenido previo

        alojamientos.forEach((alojamiento, index) => {
            const alojamientoLi = document.createElement("li");
            alojamientoLi.classList.add("splide__slide", "contenedor-alojamiento");

            alojamientoLi.innerHTML = `
                <div class="contenedor-Imagen">
                    <img src="${alojamiento.url_imagen}" alt="${alojamiento.nombre}">
                    <div class="precio">
                        <p>$${alojamiento.precio}/noche</p>
                    </div>
                </div>
                <div class="ubicacion-Alojamiento">
                    <p>${alojamiento.ubicacion}</p>
                </div>
                <div class="Capacidad">
                    <p>Capacidad: ${alojamiento.capacidad_huespedes}</p>
                </div>
                <button class="Mas-Detalles">Más detalles</button>
            `;
            contenedorCarrusel.appendChild(alojamientoLi);

            // Si es el primer alojamiento, añade una funcionalidad especial al botón "Más detalles"
            if (index === 0) {
                const botonMasDetalles = alojamientoLi.querySelector(".Mas-Detalles");
                botonMasDetalles.addEventListener("click", () => {
                    window.location.href = "detalles.html";
                });
            }
        });

        // Inicializa Splide después de cargar los alojamientos
        var splide = new Splide('.splide', {
            perPage: 5, // Mostrar 5 elementos
            focus: 0,  // Centrar el carrusel
            omitEnd: true, // Detener en el último elemento
            pagination: false, // Desactivar paginación
            arrows: true, // Flechas de navegación
            gap: '10px', // Espacio entre elementos
            
        });

        splide.mount(); // Montar el carrusel
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
            cargarHuespedes(data);
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

function cargarHuespedes(data) {
    const roomsSelect = document.getElementById('rooms');
    const huespedes = [...new Set(data.map(alojamiento => alojamiento.capacidad_huespedes))].sort((a, b) => a - b);

    huespedes.forEach(num => {
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
        const coincideHabitaciones = !rooms || alojamiento.capacidad_huespedes === Number(rooms);
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
        alojamientoCard.classList.add('alojamiento-card');
        
        alojamientoCard.innerHTML = `
            <img src="${alojamiento.url_imagen}" alt="${alojamiento.nombre}">
            <h3>${alojamiento.nombre}</h3>
            <p><strong>Ubicación:</strong> ${alojamiento.ubicacion}</p>
            <p><strong>Tipo:</strong> ${alojamiento.tipo_alojamiento}</p>
            <p><strong>Precio:</strong> $${alojamiento.precio}</p>
            <p><strong>Capacidad:</strong> ${alojamiento.capacidad_huespedes}</p>
            <p><strong>Descripción:</strong> ${alojamiento.descripcion_corta}</p>
        `;

        resultsContainer.appendChild(alojamientoCard);
    });
}

// Llama a la función para cargar los filtros y configuraciones al cargar la página
window.onload = cargarFiltros;


























   



