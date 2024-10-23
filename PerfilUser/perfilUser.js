document.addEventListener("DOMContentLoaded", function() {
    const profileMenuToggle = document.getElementById('profileMenuToggle');
    const profileMenu = document.getElementById('profileMenu');
    
    // Lógica para el menú desplegable de la foto de perfil
    profileMenuToggle.addEventListener('click', function() {
        const isVisible = profileMenu.style.display === 'block';
        profileMenu.style.display = isVisible ? 'none' : 'block';
    });

    // Ocultar el menú si se hace clic fuera de él
    document.addEventListener('click', function(event) {
        if (!profileMenuToggle.contains(event.target) && !profileMenu.contains(event.target)) {
            profileMenu.style.display = 'none';
        }
    });

    // Realiza la solicitud para obtener los datos de la sesión
    fetch('/PWCI-Repo/backend/get_session.php')
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Verifica que los datos de la sesión llegan correctamente
            if (data.loggedIn) {
                // Ocultar botones de iniciar sesión y registro
                document.querySelector('.auth-buttons').style.display = 'none';
                document.getElementById('userProfile').style.display = 'block';

                // Establecer avatar del usuario
                document.querySelector('.avatar').src = 'http://localhost/PWCI-Repo/backend/' + data.avatar;
                

                // Filtrar el menú por rol de usuario
                const profileMenu = document.getElementById('profileMenu');
                profileMenu.innerHTML = '';  // Limpiar el menú actual

                // Mostrar elementos según el rol del usuario
                if (data.rol == 1) {  // Estudiante
                    profileMenu.innerHTML += '<a href="http://localhost/PWCI-Repo/PerfilUser/perfilUser.html">Ver Perfil</a>';
                    profileMenu.innerHTML += '<a href="http://localhost/PWCI-Repo/MisCursos/perfilEstudiante.html">Ver mis cursos</a>';
                    profileMenu.innerHTML += '<a href="http://localhost/PWCI-Repo/logIn/logIn.html">Cerrar sesión</a>';
                } else if (data.rol == 2) {  // Instructor
                    profileMenu.innerHTML += '<a href="http://localhost/PWCI-Repo/PerfilUser/perfilUser.html">Ver Perfil</a>';
                    profileMenu.innerHTML += '<a href="http://localhost/PWCI-Repo/PerfilInstructor/perfilInstructor.html">Ver mis ventas</a>';
                    profileMenu.innerHTML += '<a href="http://localhost/PWCI-Repo/logIn/logIn.html">Cerrar sesión</a>';
                } else if (data.rol == 3) {  // Administrador
                    profileMenu.innerHTML += '<a href="http://localhost/PWCI-Repo/PerfilUser/perfilUser.html">Ver Perfil</a>';
                    profileMenu.innerHTML += '<a href="http://localhost/PWCI-Repo/PerfilAdmin/admin.html">Ver reportes</a>';
                    profileMenu.innerHTML += '<a href="http://localhost/PWCI-Repo/logIn/logIn.html">Cerrar sesión</a>';
                }

            // Asignar los datos al formulario de perfil
            document.getElementById('fullName').value = data.Nombre;
            document.getElementById('email').value = data.Correo;
            const fechaFormateada = new Date(data.Cumple).toISOString().split('T')[0];
            document.getElementById('dob').value = fechaFormateada;
            document.getElementById('profile-avatar').src = '/PWCI-Repo/backend/uploads/' + data.avatar;

            // Mapeo de género
            let generoMap = {
                1: 'masculino',
                2: 'femenino',
                3: 'otro'
            };
            document.getElementById('gender').value = generoMap[data.Genero];
            }
        })
        .catch(error => console.error('Error:', error));

    const editProfileBtn = document.getElementById("editProfileBtn");
    const profileForm = document.getElementById("profileForm");
    const saveChangesBtn = document.getElementById("saveChangesBtn");
    const changePhotoBtn = document.getElementById("changePhotoBtn");

    editProfileBtn.addEventListener("click", function() {
        const inputs = profileForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.removeAttribute('readonly');
            input.disabled = false;
        });
        saveChangesBtn.style.display = 'block';
    });



// Función para validar el formato del email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para validar contraseña con los requisitos
function validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
}

// Evento para guardar los cambios en el perfil
saveChangesBtn.addEventListener("click", function() {
    const nombreCompleto = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const genero = document.getElementById('gender').value;
    const fechaNacimiento = document.getElementById('dob').value;
    const contrasena = document.getElementById('password').value;

    // Validaciones
    if (nombreCompleto.trim() === "") {
        alert("El nombre completo es obligatorio.");
        return;
    }

    if (!validateEmail(email)) {
        alert("Por favor, ingresa un correo electrónico válido.");
        return;
    }

    // Validar la contraseña solo si se está modificando
    if (contrasena.trim() !== "") {
        if (!validatePassword(contrasena)) {
            alert("La contraseña debe tener al menos 8 caracteres, incluir un número, una letra mayúscula y un carácter especial.");
            return;
        }
    }

    // Enviar la contraseña como null si está vacía
    const contrasenaFinal = contrasena.trim() === "" ? null : contrasena;

    // Registro para comprobar datos que se envían
    console.log({
        nombreCompleto,
        email,
        genero,
        fechaNacimiento,
        contrasena: contrasenaFinal
    });

    fetch('/PWCI-Repo/backend/update_user.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombreCompleto,
            email,
            genero,
            fechaNacimiento,
            contrasena: contrasenaFinal
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        console.log("Respuesta del servidor: ", data); // Verificar la respuesta del servidor
        if (data.success) {
            alert("Perfil actualizado con éxito");
            disableEditing(); // Llama a la función para deshabilitar la edición
        } else {
            alert("Error al actualizar el perfil: " + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error al comunicarse con el servidor.");
    });
});



    changePhotoBtn.addEventListener("click", function() {
        alert("Cambiar foto de perfil.");
    });

    // Lógica para eliminar la cuenta
    const deleteAccountBtn = document.getElementById("deleteAccountBtn");
    deleteAccountBtn.addEventListener("click", function() {
        if (confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.")) {
            fetch('delete_account.php', {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Cuenta eliminada con éxito.");
                    window.location.href = "/logIn/logIn.html"; // Redirigir a la página de inicio de sesión
                } else {
                    alert("Error al eliminar la cuenta: " + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });
});

// Función para deshabilitar la edición
function disableEditing() {
    const profileForm = document.getElementById("profileForm");
    const inputs = profileForm.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.setAttribute('readonly', 'readonly');
        input.disabled = true;
    });
    document.getElementById('saveChangesBtn').style.display = 'none';
}