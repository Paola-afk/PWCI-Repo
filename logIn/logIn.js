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

    // Crear un FormData para enviar los datos al servidor
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    // Enviar la solicitud al servidor
    fetch('/PWCI-Repo/backend/logIn.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text()) // Obtener la respuesta como texto
    .then(data => {
        console.log("Respuesta del servidor:", data); // Ver la respuesta en la consola

        // Limpiar la respuesta y manejar los resultados
        const trimmedData = data.trim(); // Elimina espacios en blanco

        if (trimmedData === "success") {
            Swal.fire({
                icon: 'success',
                title: 'Inicio de sesión exitoso',
                text: 'Serás redirigido a la página principal.',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = 'http://localhost/PWCI-Repo/Inicio/inicio.html';
            });
        } else if (trimmedData === "password_incorrect") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La contraseña es incorrecta.',
            });
        } else if (trimmedData === "user_not_found") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se encontró el usuario.',
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error inesperado',
                text: 'Ocurrió un error inesperado, por favor intenta de nuevo.',
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error de red',
            text: 'No se pudo conectar con el servidor. Intenta de nuevo más tarde.',
        });
    });
});
