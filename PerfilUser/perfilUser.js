//Acciones al picar la foto del usuario en header
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
});

document.addEventListener("DOMContentLoaded", function() {
    const editProfileBtn = document.getElementById("editProfileBtn");
    const changePhotoBtn = document.getElementById("changePhotoBtn");
    const profileForm = document.getElementById("profileForm");
    const saveChangesBtn = document.getElementById("saveChangesBtn");
    const avatarImg = document.getElementById("avatarImg");

    editProfileBtn.addEventListener("click", function() {
        const inputs = profileForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.removeAttribute('readonly');
            input.disabled = false;
        });
        saveChangesBtn.style.display = 'block';
    });

    saveChangesBtn.addEventListener("click", function() {
        const inputs = profileForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.setAttribute('readonly', 'readonly');
            input.disabled = true;
        });
        saveChangesBtn.style.display = 'none';
        alert("Cambios guardados.");
    });

    changePhotoBtn.addEventListener("click", function() {
        // Implement file upload logic here
        alert("Cambiar foto de perfil.");
    });
});