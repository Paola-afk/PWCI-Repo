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