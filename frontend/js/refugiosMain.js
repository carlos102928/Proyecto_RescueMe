const API_URL_REFUGIOS = 'http://localhost:3000/api/refugio';

document.addEventListener('DOMContentLoaded', () =>{
    const contenedor = document.getElementById('contenedorRefugios');

    fetch(API_URL_REFUGIOS)
    .then(response =>{
        if (!response.ok) throw new Error ("Error en la respuesta de la red")
            return response.json();
    })
    .then(listaRefugios =>{

        listaRefugios.forEach (refugio => {
            const card = document.createElement('div');
            card.classList.add('Refugio');

            const pNombreRefugio = document.createElement('p');
            pNombreRefugio.textContent = `Refugio: ${refugio.nombre_refugio}`;
            
            const pDireccion = document.createElement('p');
            pDireccion.textContent = `Dirección: ${refugio.direccion}`

            const pCorreo = document.createElement('p');
            pCorreo.textContent = `Correo: ${refugio.correo}`;

            card.appendChild(pNombreRefugio);
            card.appendChild(pDireccion);
            card.appendChild(pCorreo);

            contenedor.appendChild(card);
            console.log(refugio);
            card.addEventListener('click', () =>{
                window.location.href = `./Animalesinf.html?id_refugio=${refugio.id_refugio}`;
            })
        })
    })
})
async function cargarRefugios() {
    try {
    const res = await fetch(API_URL_REFUGIOS);
    const datos = await res.json();
console.log(datos);
    const tabla = document.getElementById('tablaRefugios');
    tabla.innerHTML = '';
    datos.forEach(refugio => {
        tabla.innerHTML += `
        <tr>
            <td>${refugio.nombre_refugio}</td>
            <td>${refugio.direccion}</td>
            <td>${refugio.correo}</td>
        </tr>
        `;
    });
    } catch (error) {
    console.error('Error al cargar los clientes:', error);
    }
}

cargarRefugios();