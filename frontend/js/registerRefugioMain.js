document.getElementById('registerRefugioForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre_refugio = document.getElementById('nombre_refugio').value;
  const direccion = document.getElementById('direccion').value;
  const correo = document.getElementById('correo').value;
  const contraseña = document.getElementById('contraseña').value;

  // ID de rol "refugio", asegúrate de que sea el correcto en tu tabla de roles
  const id_rol = 3;

  const res = await fetch('http://localhost:3000/api/register-refugio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre_refugio,
      direccion,
      correo,
      contraseña,
      id_rol
    })
  });

  const data = await res.json();
  alert(data.message);

  if (res.status === 201) {
    window.location.href = './loginRefugio.html'; // redirige al login del refugio
  }
});