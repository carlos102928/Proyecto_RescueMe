document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id_animal = params.get('id_animal');

  fetch(`http://localhost:3000/api/animales/${id_animal}`)
    .then(res => res.json())
    .then(data => {
      const { animal } = data;
      document.getElementById('imagenAnimal').src = `${animal.imagen_url}`;
      document.getElementById('nombreAnimal').textContent = `Animal: ${animal.animal}`;
      document.getElementById('razaAnimal').textContent = `Raza: ${animal.raza}`;
      document.getElementById('refugioAnimal').textContent = `Refugio: ${animal.nombre_refugio}`;
    })
    .catch(err => {
      console.error("Error al cargar el detalle del animal", err);
    });
})

document.getElementById('formAdopcion').addEventListener('submit', async function (e) {
  e.preventDefault();

  const checkbox = document.getElementById('checkboxCompromiso');
  const intenciones = document.getElementById('intenciones').value.trim();
  const correo = localStorage.getItem('correo');

  if (!checkbox.checked || !intenciones) {
    alert("Debes aceptar el compromiso y escribir tus intenciones para continuar.");
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const id_animal = urlParams.get('id_animal'); // ✅ corrección previa

  try {
    const response = await fetch('http://localhost:3000/api/adopciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_animal, correo, intenciones })
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message || "Solicitud enviada con éxito");
      // ✅ Redirigir a página de adopción en proceso
      window.location.href = './AdopcionRe.html';
    } else {
      alert(data.message || "Hubo un error al enviar la solicitud.");
    }
  } catch (error) {
    console.error("Error al enviar adopción:", error);
    alert("Error al enviar la solicitud.");
  }
});