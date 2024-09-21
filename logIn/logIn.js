
document.querySelector('.login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío automático del formulario

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validación del correo electrónico
    if (email === "") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El campo de correo electrónico está vacío.',
        });
        return;
    }

    // Validación del formato de correo electrónico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Correo inválido',
            text: 'Por favor, ingresa un correo electrónico válido.',
        });
        return;
    }

    // Validación de la contraseña
    if (password === "") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El campo de contraseña está vacío.',
        });
        return;
    }

    // Si pasa todas las validaciones, redirige al usuario
    Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        text: 'Serás redirigido a la página principal.',
        timer: 2000,
        showConfirmButton: false
    }).then(() => {
        // Aquí puedes redirigir a la página de inicio
        window.location.href = '/Inicio/inicio.html';
    });
});
