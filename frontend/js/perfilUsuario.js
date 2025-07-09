const API_MI_INFO = "http://localhost:3000/api/adoptantes/perfil";
const API_ACTUALIZAR_CAMPO = "http://localhost:3000/api/adoptantes/actualizar-campo";

document.addEventListener("DOMContentLoaded", async () => {
  const correo = localStorage.getItem("correo");
  if (!correo) {
    alert("Sesión inválida.");
    return window.location.replace("../../Inicio.html");
  }

  try {
    const res = await fetch(`${API_MI_INFO}?correo=${correo}`);
    const data = await res.json();

    document.getElementById("nombre").value = data.nombre;
    document.getElementById("correo").value = data.correo;

  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
  }
});

async function actualizarCampo(campo) {
  const correo = localStorage.getItem("correo");
  let valor;

  switch (campo) {
    case "nombre":
      valor = document.getElementById("nombre").value;
      break;
    case "correo":
      valor = document.getElementById("correo").value;
      break;
    case "contraseña":
      valor = document.getElementById("contraseña").value;
      break;
    default:
      return;
  }

  try {
    const res = await fetch(API_ACTUALIZAR_CAMPO, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correoActual: correo, campo, valor })
    });

    const data = await res.json();
    document.getElementById("mensajePerfil").innerText = data.mensaje;

    if (campo === "correo") {
      localStorage.setItem("correo", valor); // actualizar localStorage
    }
  } catch (error) {
    console.error("Error actualizando:", error);
    document.getElementById("mensajePerfil").innerText = "Error al actualizar.";
  }
}
