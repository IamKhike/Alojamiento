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
        const alojamiento = data.find(item => item.id === 1); // Cambiar ID según la lógica
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

document.addEventListener("DOMContentLoaded", async () => {
    const reservationsTable = document.getElementById("reservations-table").querySelector("tbody");
    const montoTotalElement = document.getElementById("monto-total");
    const modalEditar = document.getElementById("modal-editar");
    const formEditar = document.getElementById("form-editar");

    const usuarioId = localStorage.getItem("usuario");

    let montoTotal = 0; // Se guarda esta variable para utilizarla en los precios totales

    if (!usuarioId) {
        alert("Debes iniciar sesión para ver tus reservas.");
        window.location.href = "InicioSesion.html";
        return;
    }

    try {
        const alojamientoId = 1; // Cambiar según tu lógica
        const fechasOcupadas = await obtenerFechasOcupadas(alojamientoId);

        const response = await fetch(`http://localhost:5277/api/Reservas/ObtenerReservasPorUsuario/${usuarioId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Error al obtener las reservas.");

        const reservas = await response.json();

        if (reservas.length === 0) {
            reservationsTable.innerHTML = `<tr><td colspan="7" style="text-align: center;">No tienes reservas registradas.</td></tr>`;
            return;
        }

        reservas.forEach((reserva) => {
            montoTotal += reserva.precio;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <div class="alojamiento-info">
                        <img src="${reserva.alojamiento.url_imagen}" alt="Imagen de ${reserva.alojamiento.nombre}" class="alojamiento-img">
                        <div>
                            <p><strong>${reserva.alojamiento.nombre}</strong></p>
                            <p>${reserva.alojamiento.ubicacion}</p>
                        </div>
                    </div>
                </td>
                <td>${new Date(reserva.fecha_inicio).toLocaleDateString()}</td>
                <td>${new Date(reserva.fecha_fin).toLocaleDateString()}</td>
                <td>${reserva.numero_huespedes}</td>
                <td>$${reserva.precio.toFixed(2)}</td>
                <td>
                    <button class="delete-btn" data-reserva-id="${reserva.id}">Eliminar</button>
                    <button class="edit-btn" data-reserva-id="${reserva.id}">Modificar</button>
                </td>
            `;
            reservationsTable.appendChild(row);
        });

        montoTotalElement.textContent = montoTotal.toFixed(2);

        // Configuración de Flatpickr para fechas ocupadas en el modal de edición
        flatpickr("#editar-fecha-inicio", {
            dateFormat: "Y-m-d",
            disable: fechasOcupadas,
            minDate: "today",
            onChange: function (selectedDates) {
                const minDate = new Date(selectedDates[0]);
                minDate.setDate(minDate.getDate() + 1); // Mínimo un día después
                const fechaFinPicker = document.getElementById("editar-fecha-fin")._flatpickr;
                fechaFinPicker.set("minDate", minDate); // Actualiza la fecha mínima del campo "fecha fin"
                fechaFinPicker.setDate(null); // Limpia la fecha seleccionada se);
            },
        });

        flatpickr("#editar-fecha-fin", {
            dateFormat: "Y-m-d",
            disable: fechasOcupadas,
            minDate: "today",
        });

        // Agregar eventos para eliminar reservas
        document.querySelectorAll(".delete-btn").forEach((button) => {
            button.addEventListener("click", async (e) => {
                const reservaId = e.target.getAttribute("data-reserva-id");

                if (!confirm("¿Estás seguro de que deseas eliminar esta reserva?")) {
                    return;
                }

                try {
                    const response = await fetch(`http://localhost:5277/api/Reservas/${reservaId}/Usuario/${usuarioId}`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || "Error al eliminar la reserva.");
                    }

                    alert("Reserva eliminada correctamente.");
                    window.location.reload();
                } catch (error) {
                    console.error("Error al eliminar la reserva:", error);
                    alert("Hubo un problema al eliminar la reserva. Por favor, inténtalo de nuevo.");
                }
            });
        });

        // Agregar eventos para modificar reservas
        document.querySelectorAll(".edit-btn").forEach((button) => {
            button.addEventListener("click", async (e) => {
                const reservaId = e.target.getAttribute("data-reserva-id");
                const reserva = reservas.find(r => r.id == reservaId);

                const precioPorNoche = await obtenerPrecioAlojamiento();

                if (!precioPorNoche) return;

                // Llenar el formulario con los datos actuales de la reserva
                document.getElementById("reserva-id").value = reservaId;
                document.getElementById("editar-fecha-inicio").value = reserva.fecha_inicio.split("T")[0];
                document.getElementById("editar-fecha-fin").value = reserva.fecha_fin.split("T")[0];
                document.getElementById("editar-numero-huespedes").value = reserva.numero_huespedes;

                // Mostrar el modal
                modalEditar.style.display = "block";

                // Calcular el precio total dinámicamente
                document.getElementById("editar-fecha-inicio").addEventListener("change", () => calcularPrecioTotal(precioPorNoche));
                document.getElementById("editar-fecha-fin").addEventListener("change", () => calcularPrecioTotal(precioPorNoche));
                document.getElementById("editar-numero-huespedes").addEventListener("input", () => calcularPrecioTotal(precioPorNoche));
            });
        });

        formEditar.addEventListener("submit", async (e) => {
            e.preventDefault();

            const reservaId = document.getElementById("reserva-id").value;
            const fechaInicio = document.getElementById("editar-fecha-inicio").value;
            const fechaFin = document.getElementById("editar-fecha-fin").value;
            const numeroHuespedes = parseInt(document.getElementById("editar-numero-huespedes").value);
            const precio = parseFloat(document.getElementById("editar-precio").value);

            try {
                const response = await fetch(`http://localhost:5277/api/Reservas/${reservaId}/Usuario/${usuarioId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        alojamiento_id: 1, // Esto debería ser dinámico si cambia
                        usuario_id: parseInt(usuarioId),
                        fecha_inicio: fechaInicio,
                        fecha_fin: fechaFin,
                        precio: precio,
                        numero_huespedes: numeroHuespedes,
                    }),
                });

                if (!response.ok) throw new Error("Error al modificar la reserva.");

                alert("Reserva modificada correctamente.");
                window.location.reload();
            } catch (error) {
                alert("Error al modificar la reserva. Inténtelo nuevamente.");
            }
        });
    } catch (error) {
        alert("Error al cargar las reservas. Inténtelo nuevamente.");
    }
});

function calcularPrecioTotal(precioPorNoche) {
    const fechaInicio = document.getElementById("editar-fecha-inicio").value;
    const fechaFin = document.getElementById("editar-fecha-fin").value;
    const numeroHuespedes = document.getElementById("editar-numero-huespedes").value;

    if (!fechaInicio || !fechaFin || !numeroHuespedes) return;

    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);

    const noches = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    if (noches > 0) {
        const totalPrecio = noches * precioPorNoche;
        document.getElementById("editar-precio").value = totalPrecio.toFixed(2);
    } else {
        document.getElementById("editar-precio").value = "0.00";
    }
}

// Cerrar el modal
function cerrarModal() {
    document.getElementById("modal-editar").style.display = "none";
}
