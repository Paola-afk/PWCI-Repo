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



                if (data.avatar && data.avatar !== '') {
                    document.getElementById('profile-avatar').src = 'http://localhost/PWCI-Repo/backend/' + data.avatar;
                }

                if (data.Genero && data.Genero !== '') {
                    let genero = data.Genero.trim().toLowerCase(); // Normaliza el valor
                
                    // Compara el valor normalizado con las opciones disponibles
                    if (genero === 'masculino' || genero === 'femenino' || genero === 'otro') {
                        document.getElementById('gender').value = genero; // Asignar valor al select
                    } else {
                        console.error('Valor de género no reconocido:', genero);
                    }
                }
                

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

// Función para validar el formato del email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
// Función para validar la contraseña
function validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
}

///editar ususario este es el bueno

saveChangesBtn.addEventListener("click", function() {
    const nombreCompleto = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const genero = document.getElementById('gender').value;
    const fechaNacimiento = document.getElementById('dob').value;
    const contrasena = document.getElementById('password').value;

// Validaciones
if (nombreCompleto.trim() === "") {
    Swal.fire({
        title: 'Campo obligatorio',
        text: 'El nombre completo es obligatorio.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
    });
    return;
}

if (!validateEmail(email)) {
    Swal.fire({
        title: 'Correo inválido',
        text: 'Por favor, ingresa un correo electrónico válido.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
    });
    return;
}

if (contrasena.trim() !== "" && !validatePassword(contrasena)) {
    console.log(Swal);
    Swal.fire({
        title: 'Contraseña no válida',
        text: 'La contraseña debe tener al menos 8 caracteres, incluir un número, una letra mayúscula y un carácter especial.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
    });
    return;
}


    // Crear un objeto FormData para enviar los datos
    const formData = new FormData();
    formData.append('nombre', nombreCompleto);
    formData.append('email', email);
    formData.append('genero', genero);
    formData.append('fechaNacimiento', fechaNacimiento);
    formData.append('contrasena', contrasena);

    // Realizar la petición AJAX
        // Realizar la petición AJAX
    fetch('/PWCI-Repo/backend/EditarUsu.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json()) // Asegúrate de que el backend responda con JSON
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: '¡Perfil actualizado!',
                text: data.message, // Mensaje del servidor
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            disableEditing();
        } else {
            Swal.fire({
                title: 'Error',
                text: data.message, // Mensaje del servidor en caso de error
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al intentar actualizar tu perfil.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    });


});


 //editar foto
// Obtener userId desde el campo oculto en el HTML
const userId = document.getElementById('userId').value;

// Manejar el clic en el botón de cambiar foto
document.getElementById('changePhotoBtn').addEventListener('click', function() {
    document.getElementById('avatarInput').click();
});

// Manejar el cambio en el input de archivo
document.getElementById('avatarInput').addEventListener('change', function() {
    const fileInput = document.getElementById('avatarInput');
    const file = fileInput.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('user_id', userId); // Ahora estamos usando el userId correcto

        fetch('/PWCI-Repo/backend/update_avatar.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire('¡Éxito!', 'Avatar actualizado correctamente.', 'success');
                document.getElementById('profile-avatar').src = data.new_avatar_url;
            } else {
                Swal.fire('Error', data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Ocurrió un error al procesar la solicitud.', 'error');
        });
    }
});

// Manejar el clic en el botón de usar Gravatar
document.getElementById('useGravatarBtn').addEventListener('click', function() {
    const formData = new FormData();
    formData.append('use_gravatar', '1');
    formData.append('user_id', userId);

    fetch('/PWCI-Repo/backend/update_avatar.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire('¡Éxito!', 'Avatar actualizado a Gravatar correctamente.', 'success');
            document.getElementById('profile-avatar').src = data.new_avatar_url;
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Ocurrió un error al procesar la solicitud.', 'error');
    });
});
