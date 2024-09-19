function validateForm(event) {
    event.preventDefault(); // Evita el envío del formulario para validar primero

    // Limpia mensajes de error previos
    document.getElementById('name-error').textContent = '';
    document.getElementById('email-error').textContent = '';
    document.getElementById('birthdate-error').textContent = '';
    document.getElementById('password-error').textContent = '';

    let isValid = true;

    // Validación del nombre (campo obligatorio)
    const name = document.getElementById('name').value;
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!name) {
        document.getElementById('name-error').textContent = 'El nombre es obligatorio.';
        isValid = false;
    } else if (!nameRegex.test(name)) {
        document.getElementById('name-error').textContent = 'El nombre solo debe contener letras y espacios.';
        isValid = false;
    }

    // Validación del email (campo obligatorio)
    const email = document.getElementById('email').value;
    if (!email) {
        document.getElementById('email-error').textContent = 'El correo electrónico es obligatorio.';
        isValid = false;
    } else if (!validateEmail(email)) {
        document.getElementById('email-error').textContent = 'Ingresa un correo electrónico válido.';
        isValid = false;
    }

    // Validación de la fecha de nacimiento (campo obligatorio y no puede ser fecha actual o futura)
    const fechaNacimiento = document.getElementById('fecha-nacimiento').value;
    const today = new Date().toISOString().split('T')[0]; // Fecha actual en formato yyyy-mm-dd
    if (!fechaNacimiento) {
        document.getElementById('birthdate-error').textContent = 'La fecha de nacimiento es obligatoria.';
        isValid = false;
    } else if (fechaNacimiento >= today) {
        document.getElementById('birthdate-error').textContent = 'La fecha de nacimiento no puede ser la actual o una fecha futura.';
        isValid = false;
    }

    // Validación de la contraseña (campo obligatorio y debe cumplir con los requisitos)
    const password = document.getElementById('password').value;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!password) {
        document.getElementById('password-error').textContent = 'La contraseña es obligatoria.';
        isValid = false;
    } else if (!passwordRegex.test(password)) {
        document.getElementById('password-error').textContent = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un carácter especial y un número.';
        isValid = false;
    }

    // Si todas las validaciones pasan
    if (isValid) {
        alert('Registro exitoso (simulado).');
        return true;
    } else {
        return false;
    }
}

// Función para validar el formato del email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
