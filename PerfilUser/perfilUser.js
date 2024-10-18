document.addEventListener("DOMContentLoaded", function() {
    const profileMenuToggle = document.getElementById('profileMenuToggle');
    const profileMenu = document.getElementById('profileMenu');

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

        if (contrasena.trim() !== "" && contrasena.length < 8) {
            alert("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        fetch('update_profile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombreCompleto,
                email,
                genero,
                fechaNacimiento,
                contrasena
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Perfil actualizado con éxito");
                disableEditing(); // Llama a la función para deshabilitar la edición
            } else {
                alert("Error al actualizar el perfil: " + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
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
