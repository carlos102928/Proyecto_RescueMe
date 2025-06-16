const API_URL_ADOPTANTES = 'http://localhost:3000/api/adoptantes';

async function cargarAdoptantes(){
    try{
    const res = await fetch(API_URL_ADOPTANTES);
    const datos = await res.json();
    console.log(datos);
    const tabla = document.getElementById('tablaAdoptantes');
    tabla.innerHTML = '';
    datos.forEach(adoptante => {
        tabla.innerHTML += `
        <tr>
        <td>${adoptante.id_usuario}</td>
        <td>${adoptante.nombre}</td>
        <td>${adoptante.correo}</td>
        <td>${adoptante.rol}</td>
        </tr>
        `;
    });
    } catch (error){
        console.log('Error al cargar los adoptantes', error)
    }
}

cargarAdoptantes();