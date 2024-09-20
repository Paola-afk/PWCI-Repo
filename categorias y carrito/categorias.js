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


        let scrollAmount = 0;

        function slide(direction) {
            const slider = document.getElementById('slider');
            const sliderWidth = slider.scrollWidth - slider.clientWidth;
            const scrollStep = 300; // Ajustar el valor según el tamaño de las tarjetas

            if (direction === 'left') {
                scrollAmount -= scrollStep;
                if (scrollAmount < 0) scrollAmount = 0;
            } else {
                scrollAmount += scrollStep;
                if (scrollAmount > sliderWidth) scrollAmount = sliderWidth;
            }

            slider.style.transform = `translateX(-${scrollAmount}px)`;
        }