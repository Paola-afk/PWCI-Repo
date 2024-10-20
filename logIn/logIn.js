document.querySelector('.login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío automático del formulario para validar primero

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

    // Enviar los datos del formulario al servidor usando AJAX
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    // Agrega mensajes de depuración en consola
    console.log("Enviando solicitud al servidor...");

    fetch('http://localhost/PWCI-Repo/backend/logIn.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log("Respuesta recibida:", response);
        return response.text(); // Convertir la respuesta a texto
    })
    .then(result => {
        console.log("Resultado procesado:", result); // Mostrar el resultado devuelto por PHP
        if (result === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'Inicio de sesión exitoso',
                text: 'Redirigiendo...',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = 'http://localhost/PWCI-Repo/Inicio/inicio.html';
            });
        } else if (result === 'password_incorrect') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Contraseña incorrecta.'
            });
        } else if (result === 'user_not_found') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Usuario no encontrado.'
            });
        } else {
            console.log("Error inesperado:", result);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error inesperado.'
            });
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error); // Mostrar cualquier error de red
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error en el servidor.'
        });
    });
});

