// Función para obtener las fechas ocupadas del alojamiento desde el API
async function obtenerFechasOcupadas(alojamientoId) {
    try {
        const response = await fetch(`http://localhost:5277/api/Reservas/FechasOcupadas/${alojamientoId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error al obtener fechas ocupadas: ${response.status}`);
        }

        const data = await response.json();
        return data; // Array de fechas ocupadas en formato ISO (YYYY-MM-DD)
    } catch (error) {
        console.error('Error al obtener fechas ocupadas:', error);
        alert('Hubo un problema al obtener las fechas ocupadas. Por favor, inténtelo más tarde.');
        return [];
    }
}

// Función para deshabilitar automáticamente las fechas ocupadas
function deshabilitarFechasOcupadas(fechasOcupadas) {
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    const fechasSet = new Set(fechasOcupadas); // Usamos un Set para búsquedas rápidas

    // Validar fechas ocupadas al seleccionar
    const validarFecha = (input) => {
        input.addEventListener('input', (e) => {
            const selectedDate = e.target.value;
            if (fechasSet.has(selectedDate)) {
                alert('La fecha seleccionada ya está ocupada. Por favor, elige otra fecha.');
                e.target.value = ''; // Limpia el campo si se selecciona una fecha inválida
            }
        });
    };

    // Aplicar validación a ambos inputs
    validarFecha(checkInInput);
    validarFecha(checkOutInput);
}

// Función para obtener el precio del alojamiento desde el API
async function obtenerPrecioAlojamiento() {
    try {
        const response = await fetch('http://localhost:5277/api/Alojamientos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
        }

        const data = await response.json();
        const alojamiento = data.find(item => item.id === 1); // Cambiar ID según tu lógica
        if (!alojamiento) {
            throw new Error('Alojamiento no encontrado');
        }

        return alojamiento.precio;
    } catch (error) {
        console.error('Error al obtener el precio:', error);
        alert('Hubo un problema al obtener el precio. Por favor, inténtalo de nuevo.');
        return null;
    }
}

// Función para calcular la diferencia de noches
function calcularNoches(fechaInicio, fechaFin) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    if (inicio >= fin) {
        alert('La fecha de salida debe ser posterior a la fecha de entrada');
        return 0;
    }
    const diferencia = fin.getTime() - inicio.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24));
}

// Función para actualizar la visualización del precio
function actualizarVisualizacionPrecio(precioPorNoche, noches, precioTotal) {
    const divCalculo = document.getElementById('calcular-precio');
    divCalculo.style.display = 'block';
    document.getElementById('precio-por-noche').textContent = precioPorNoche?.toFixed(2) || '0.00';
    document.getElementById('total-noches').textContent = noches;
    document.getElementById('precio-total').textContent = precioTotal?.toFixed(2) || '0.00';
}

// Función para calcular y mostrar el precio total
async function calcularPrecioTotal() {
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;

    if (!checkIn || !checkOut) {
        console.log('Ambas fechas son necesarias para el cálculo');
        return;
    }

    const noches = calcularNoches(checkIn, checkOut);
    if (noches <= 0) {
        actualizarVisualizacionPrecio(0, 0, 0);
        return;
    }

    const precioPorNoche = await obtenerPrecioAlojamiento();
    if (precioPorNoche === null) {
        actualizarVisualizacionPrecio(0, noches, 0);
        return;
    }

    const precioTotal = noches * precioPorNoche;
    actualizarVisualizacionPrecio(precioPorNoche, noches, precioTotal);
}

// Función para enviar la reserva
async function enviarReserva() {
    const usuarioId = localStorage.getItem('usuario'); // Obtener el ID del usuario desde localStorage

    if (!usuarioId) {
        alert('Debes iniciar sesión para realizar una reserva.');
        window.location.href = 'InicioSesion.html';
        return;
    }

    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
    const guests = document.getElementById('guests').value;
    const precioTotal = parseFloat(document.getElementById('precio-total').textContent);

    if (!checkIn || !checkOut || !guests) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    try {
        const checkInDate = new Date(checkIn).toISOString(); // Convertir a formato ISO 8601 en UTC
        const checkOutDate = new Date(checkOut).toISOString();

        const response = await fetch('http://localhost:5277/api/Reservas/CrearReservas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                alojamiento_id: 1, // Cambiar por el ID del alojamiento correspondiente
                usuario_id: parseInt(usuarioId),
                fecha_inicio: checkIn,
                fecha_fin: checkOut,
                precio: precioTotal,
                numero_huespedes: parseInt(guests),
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error: ${response.status}`);
        }

        alert('¡Reserva realizada con éxito!');
        window.location.href = 'MisReservas.html';
    } catch (error) {
        console.error('Error al realizar la reserva:', error);
        alert('Hubo un problema al realizar la reserva. Por favor, inténtelo de nuevo.');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const alojamientoId = 1; // Cambiar por el ID dinámico si es necesario
    const fechasOcupadas = await obtenerFechasOcupadas(alojamientoId); // Obtener fechas ocupadas

    // Configuración de Flatpickr para "check-in"
    flatpickr("#check-in", {
        dateFormat: "Y-m-d", // Formato de fecha
        disable: fechasOcupadas, // Fechas deshabilitadas
        minDate: "today", // Deshabilitar fechas pasadas
        onChange: function(selectedDates) {
            // Ajustar la fecha mínima para el campo "check-out"
            const minDate = new Date(selectedDates[0]);
            minDate.setDate(minDate.getDate() + 1); // Mínimo un día después
            document.getElementById("check-out").flatpickr.set("minDate", minDate);
            calcularPrecioTotal(); // Calcular precio al cambiar la fecha
        },
    });

    // Configuración de Flatpickr para "check-out"
    flatpickr("#check-out", {
        dateFormat: "Y-m-d", // Formato de fecha
        disable: fechasOcupadas, // Fechas deshabilitadas
        minDate: "today", // Deshabilitar fechas pasadas
        onChange: calcularPrecioTotal, // Calcular precio al cambiar la fecha
    });

    // Formulario de reserva
    const bookingForm = document.getElementById('booking-form');
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        enviarReserva();
    });
});


