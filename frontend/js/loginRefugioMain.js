document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const correo = document.getElementById('correo').value;
  const contraseña = document.getElementById('contraseña').value;

  const res = await fetch('http://localhost:3000/api/login-refugio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contraseña })
  });

  const data = await res.json();

  if (res.status === 200) {
    localStorage.setItem('rol', data.rol);
    localStorage.setItem('correo', correo);
    localStorage.setItem('id_refugio', data.id_refugio);
    if (data.rol === 'refugio') {
      window.location.href = '/pages/refugios/InicioR.html';
    }
  } else {
    alert(data.message);
  }
});