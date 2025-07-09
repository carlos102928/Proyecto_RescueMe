const API_MI_INFO_URL = "http://localhost:3000/api/mi-info";

async function CargarNombreUsuarioLogueadoDesdeDB() {
    const contenedor = document.getElementById('nombreUsuario');
    if (!contenedor) {
        console.error("Error: No se encontró el elemento con ID 'nombreUsuario'.");
        return;
    }
    contenedor.innerHTML = '<p>Cargando nombre...</p>';
    const userCorreo = localStorage.getItem('correo'); 

    if (!userCorreo) {

        contenedor.innerHTML = '<p>Por favor, <br/> <a href="../../Inicio.html">inicie sesión</a></p>';
        localStorage.removeItem('rol');
        localStorage.removeItem('correo');
        localStorage.removeItem('nombre'); 
        return;
    }

    try {
        const response = await fetch(`${API_MI_INFO_URL}?correo=${encodeURIComponent(userCorreo)}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error al cargar el nombre: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();

        if (data && data.nombre) {

if (data && data.nombre) {
    contenedor.innerHTML = `
      <h4>
        <a href="../adoptante/PerfilUsuario.html" style="text-decoration: none; color: #000;">
          Bienvenido, ${data.nombre}
        </a>
      </h4>
    `;
};
        } else {
            contenedor.innerHTML = '<p>Nombre de usuario no disponible.</p>';
            localStorage.removeItem('correo');
            localStorage.removeItem('rol');
            localStorage.removeItem('nombre');
        }

    } catch (error) {
        console.error('Error al cargar el nombre del usuario:', error);
        contenedor.innerHTML = `<p style="color: red;">Error al cargar su nombre. ${error.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', CargarNombreUsuarioLogueadoDesdeDB);