
function redirectToHome(event) {
    event.preventDefault(); // Esto evita el envío real del formulario
    window.location.href = '/Inicio/inicio.html'; // Cambia esta URL por la tuya
}