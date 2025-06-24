const API_REFUGIOS = 'http://localhost:3000/api/refugio';
const API_DONACIONES_POST = 'http://localhost:3000/api/donaciones';
const API_REPORTE_DONACIONES_BASE = 'http://localhost:3000/api/refugio';

document.addEventListener('DOMContentLoaded', async () => {
    // --- Lógica para el Formulario de Registro de Donaciones ---
    const donacionForm = document.querySelector('form');
    if (donacionForm) {
        cargarRefugios();

        donacionForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const valor = parseFloat(document.getElementById('valorDonacion').value);
            const id_refugio = parseInt(document.getElementById('ListadoRefugio').value);
            const medio_pago = document.getElementById('ListadoMetodoDePago').options[
                document.getElementById('ListadoMetodoDePago').selectedIndex
            ].text;

            const id_adoptante = parseInt(localStorage.getItem('id_usuario')); // Lee id_usuario para adoptantes

            if (!id_adoptante) {
                alert('Debe iniciar sesión como adoptante.');
                return;
            }

            const donacion = { valor, medio_pago, id_adoptante, id_refugio };

            try {
                const res = await fetch(API_DONACIONES_POST, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(donacion)
                });

                const data = await res.json();
                if (res.ok) {
                    document.getElementById('Texto').textContent = data.message;
                    document.getElementById('Texto').style.display = 'block';
                } else {
                    alert(data.message);
                }
            } catch (err) {
                console.error('Error al donar:', err);
            }
        });
    }

    // --- Lógica para el REPORTE de Donaciones ---
    const tablaBody = document.querySelector('#tablaDonaciones tbody');
    const refugioTitulo = document.getElementById('refugioTitulo');
    const pageTitle = document.querySelector('title');

    if (tablaBody && refugioTitulo && pageTitle) {
        function getRefugioIdFromUrl() {
            const params = new URLSearchParams(window.location.search);
            return params.get('idRefugio');
        }
        
        const idRefugioFromURL = getRefugioIdFromUrl(); // ID si se pasa en la URL (e.g., ?idRefugio=1)
        const idRefugioFromLocalStorage = localStorage.getItem('id_refugio'); // ID si el refugio está logueado

        let idRefugioToLoad;

        // Priorizamos el ID de la URL para flexibilidad (reportes específicos)
        if (idRefugioFromURL) {
            idRefugioToLoad = idRefugioFromURL;
        } else if (idRefugioFromLocalStorage) {
            // Si no hay ID en la URL, usamos el del refugio logueado
            idRefugioToLoad = idRefugioFromLocalStorage;
        } else {
            // Si no se encuentra ID en ningún lado
            console.error('ID de refugio no encontrado en la URL ni en la sesión.');
            refugioTitulo.textContent = '¡Bienvenido! (No se pudo determinar el refugio)';
            tablaBody.innerHTML = '<tr><td colspan="3">No se pudo determinar el refugio para cargar donaciones. Por favor, inicie sesión como refugio o especifique un ID en la URL.</td></tr>';
            return; // Detenemos la ejecución si no hay ID para cargar
        }

        try {
            // Usamos el ID determinado (ya sea de URL o localStorage) para la llamada a la API
            const response = await fetch(`${API_REPORTE_DONACIONES_BASE}/${idRefugioToLoad}/donaciones-data`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            refugioTitulo.textContent = `¡Bienvenido ${data.nombreRefugio}!`;
            pageTitle.textContent = `Donaciones Recibidas - ${data.nombreRefugio}`;

            tablaBody.innerHTML = ''; // Limpiar cualquier contenido previo

            if (data.donaciones && data.donaciones.length > 0) {
                data.donaciones.forEach(donacion => {
                    const row = tablaBody.insertRow();
                    const usuarioCell = row.insertCell();
                    const valorCell = row.insertCell();
                    const fechaCell = row.insertCell();

                    usuarioCell.textContent = donacion.usuario;
                    valorCell.textContent = donacion.valor;
                    fechaCell.textContent = donacion.fecha;
                });
            } else {
                const row = tablaBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 3;
                cell.textContent = 'No se han registrado donaciones para este refugio.';
            }

        } catch (error) {
            console.error('Error al cargar las donaciones para el reporte:', error);
            refugioTitulo.textContent = '¡Bienvenido! (Error al cargar datos)';
            tablaBody.innerHTML = '<tr><td colspan="3">Error al cargar las donaciones. Intente más tarde.</td></tr>';
        }
    }
});

async function cargarRefugios() {
    try {
        const res = await fetch(API_REFUGIOS);
        const refugios = await res.json();

        const select = document.getElementById('ListadoRefugio');
        if (select) {
            select.innerHTML = '<option value="">Seleccione un refugio</option>';
            refugios.forEach(refugio => {
                const option = document.createElement('option');
                option.value = refugio.id_refugio;
                option.textContent = refugio.nombre_refugio;
                select.appendChild(option);
            });
        }
    } catch (err) {
        console.error('Error al cargar refugios:', err);
    }
}