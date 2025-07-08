const API_MI_INFO = "http://localhost:3000/api/mi-info";
const API_ACTUALIZAR = "http://localhost:3000/api/mi-info/actualizar";

document.addEventListener("DOMContentLoaded", async () => {
  const correo = localStorage.getItem("correo");
  if (!correo) {
    alert("No se encontró sesión activa.");
    window.location.replace("../../Inicio.html");
    return;
  }

  try {
    const res = await fetch(`${API_MI_INFO}?correo=${correo}`);
    const data = await res.json();

    document.getElementById("nombre").value = data.nombre;
    document.getElementById("correo").value = correo;

  } catch (error) {
    console.error("Error al cargar perfil:", error);
  }
});

document.getElementById("formPerfil").addEventListener("submit", async (e) => {
  e.preventDefault();

  const correo = localStorage.getItem("correo");
  const nombre = document.getElementById("nombre").value;
  const contrasena = document.getElementById("contrasena").value;

  try {
    const res = await fetch(API_ACTUALIZAR, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, nombre, contrasena }),
    });

    const data = await res.json();
    document.getElementById("mensajePerfil").innerText = data.mensaje || "Actualización exitosa";

  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    document.getElementById("mensajePerfil").innerText = "Hubo un error al actualizar.";
  }
});
