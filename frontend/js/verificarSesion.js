function verificarRolPermitido(rolesPermitidos = []) {
  const verificar = () => {
    const rol = localStorage.getItem('rol');

    if (!rolesPermitidos.includes(rol)) {
      window.location.replace('/pages/inicio/login.html');
    } else {
      document.body.style.display = 'block';
    }
  };

  // Verifica en carga normal
  document.addEventListener('DOMContentLoaded', verificar);

  // Verifica también si se vuelve desde el historial (flecha atrás)
  window.addEventListener('pageshow', (event) => {
    if (event.persisted || (performance.getEntriesByType("navigation")[0]?.type === 'back_forward')) {
      verificar();
    }
  });
}

// Exponer la función globalmente para que puedas llamarla desde los HTML
window.verificarRolPermitido = verificarRolPermitido;