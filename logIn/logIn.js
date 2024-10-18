document.querySelector('.login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío automático del formulario

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

    // Si todas las validaciones son correctas, permite el envío del formulario
    Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        text: 'Procesando...',
        timer: 2000,
        showConfirmButton: false
    }).then(() => {
        // Ahora permite el envío del formulario (se enviará al archivo PHP)
        //document.querySelector('.login-form').submit();
    });
});
