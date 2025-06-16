const API_URL_ANIMAL = 'http://localhost:3000/api/animales'

const contenedor = document.getElementById('contenedorAnimales')
fetch(API_URL_ANIMAL)
  .then(response => {
    if (!response.ok) throw new Error("Error en la respuesta de la red");
    return response.json();
  })
  .then(data => {
    const listaAnimales = data.animales;
    console.log("Datos recibidos:", data);

    listaAnimales.forEach(animal => {
      const card = document.createElement('div');
      card.classList.add('Animal');

      const img = document.createElement('img');
      img.src = animal.imagen_url;
      img.alt = `Imagen de ${animal.animal}`;
      img.style.width = "100%";
      img.style.borderRadius = "10px";

      const pAnimal = document.createElement('p');
      pAnimal.textContent = `Animal: ${animal.animal}`;

      const pRaza = document.createElement('p');
      pRaza.textContent = `Raza: ${animal.raza}`;

      const pRefugio = document.createElement('p');
      pRefugio.textContent = `Refugio: ${animal.nombre_refugio}`;

      card.appendChild(img);
      card.appendChild(pAnimal);
      card.appendChild(pRaza);
      card.appendChild(pRefugio);

      contenedor.appendChild(card);

      card.addEventListener('click', () => {
        window.location.href = `Animal.html?id_animal=${animal.id_animal}`;
      });
    });
  })
  .catch(error => {
    console.error("Hubo un problema con la solicitud Fetch:", error);
    contenedor.textContent = "Error al cargar los datos de animales.";
  });