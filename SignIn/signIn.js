document.querySelector('form').addEventListener('submit', validateForm);

function validateForm(event) {
    event.preventDefault(); // Evita el envío del formulario para validar primero

    let isValid = true;
    let errorMessages = [];

    // Validación del nombre (campo obligatorio)
    const name = document.getElementById('name').value.trim();
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!name) {
        errorMessages.push('El nombre es obligatorio.');
        isValid = false;
    } else if (!nameRegex.test(name)) {
        errorMessages.push('El nombre solo debe contener letras y espacios.');
        isValid = false;
    }

    // Validación del correo electrónico (campo obligatorio)
    const email = document.getElementById('email').value.trim();
    if (!email) {
        errorMessages.push('El correo electrónico es obligatorio.');
        isValid = false;
    } else if (!validateEmail(email)) {
        errorMessages.push('Ingresa un correo electrónico válido.');
        isValid = false;
    }

    // Validación de la fecha de nacimiento (no puede ser futura)
    const birthdate = document.getElementById('fecha-nacimiento').value;
    const today = new Date().toISOString().split('T')[0]; // Fecha actual en formato yyyy-mm-dd
    if (!birthdate) {
        errorMessages.push('La fecha de nacimiento es obligatoria.');
        isValid = false;
    } else if (birthdate >= today) {
        errorMessages.push('La fecha de nacimiento no puede ser la actual o una fecha futura.');
        isValid = false;
    }

    // Validación de la contraseña (mínimo 8 caracteres, 1 mayúscula, 1 especial, 1 número)
    const password = document.getElementById('password').value;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!password) {
        errorMessages.push('La contraseña es obligatoria.');
        isValid = false;
    } else if (!passwordRegex.test(password)) {
        errorMessages.push('La contraseña debe tener al menos 8 caracteres, una mayúscula, un carácter especial y un número.');
        isValid = false;
    }

    // Validación del género (campo obligatorio)
    const gender = document.getElementById('genero').value;
    if (!gender) {
        errorMessages.push('Selecciona un género.');
        isValid = false;
    }

    // Validación del rol (campo obligatorio)
    const role = document.getElementById('role').value;
    if (!role) {
        errorMessages.push('Selecciona un rol.');
        isValid = false;
    }

    // Si hay errores, muestra los mensajes con SweetAlert
    if (!isValid) {
        Swal.fire({
            icon: 'error',
            title: 'Errores en el formulario',
            html: errorMessages.join('<br>'),
            confirmButtonText: 'Corregir'
        });
    } else {
        // Si todo está correcto, muestra mensaje de éxito y envía el formulario
        Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: '¡Te has registrado correctamente!',
            confirmButtonText: 'Continuar'
        }).then(() => {
            document.querySelector('form').submit(); // Envía el formulario si es válido
        });
    }
}

// Función para validar el formato del correo electrónico
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
