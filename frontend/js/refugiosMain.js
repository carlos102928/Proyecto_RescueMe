const API_URL_REFUGIOS = 'http://localhost:3000/api/refugio';

async function eliminarRefugio(id) {
  if (!confirm("¿Estás seguro de eliminar este refugio?")) return;

  try {
    const res = await fetch(`${API_URL_REFUGIOS}/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    alert(data.mensaje);
    location.reload();
  } catch (error) {
    console.error("Error al eliminar refugio:", error);
    alert("Error al eliminar el refugio");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('contenedorRefugios');

  fetch(API_URL_REFUGIOS)
    .then(response => {
      if (!response.ok) throw new Error("Error en la respuesta de la red");
      return response.json();
    })
    .then(listaRefugios => {
      if (!listaRefugios || listaRefugios.length === 0) {
        const mensaje = document.createElement('p');
        mensaje.textContent = "No hay refugios disponibles.";
        mensaje.style.textAlign = "center";
        mensaje.style.color = "gray";
        mensaje.style.marginTop = "20px";
        contenedor.appendChild(mensaje);
        return;
      }

      listaRefugios.forEach(refugio => {
        const card = document.createElement('div');
        card.classList.add('Refugio');

        const pNombreRefugio = document.createElement('p');
        pNombreRefugio.textContent = `Refugio: ${refugio.nombre_refugio}`;

        const pDireccion = document.createElement('p');
        pDireccion.textContent = `Dirección: ${refugio.direccion}`;

        const pCorreo = document.createElement('p');
        pCorreo.textContent = `Correo: ${refugio.correo}`;

        card.appendChild(pNombreRefugio);
        card.appendChild(pDireccion);
        card.appendChild(pCorreo);

        contenedor.appendChild(card);

        card.addEventListener('click', () => {
          window.location.href = `./Animalesinf.html?id_refugio=${refugio.id_refugio}`;
        });
      });
    })
    .catch(error => {
      console.error("Error al cargar los refugios:", error);
      const mensaje = document.createElement('p');
      mensaje.textContent = "Error al cargar los datos de los refugios.";
      mensaje.style.color = "red";
      mensaje.style.textAlign = "center";
      contenedor.appendChild(mensaje);
    });
});