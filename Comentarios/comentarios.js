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


function bloquearComentario(button) {
            // Simulación de bloqueo del comentario
            button.parentElement.style.display = 'none';  // Oculta el comentario tras "bloquearlo"
            alert('Comentario bloqueado con éxito');
        }


        function calcularPromedioCalificaciones() {
        // Obtener todas las calificaciones (estrellas en formato ⭐)
        const estrellasElementos = document.querySelectorAll('.text-yellow-400');
        let totalEstrellas = 0;
        let cantidadComentarios = estrellasElementos.length;

        // Si no hay comentarios, evitar el cálculo
        if (cantidadComentarios === 0) {
            document.getElementById('average-rating').textContent = "No hay calificaciones disponibles.";
            return;
        }

        // Contar cuántas estrellas tiene cada comentario
        estrellasElementos.forEach(estrellasElemento => {
            let numeroEstrellas = estrellasElemento.textContent.trim().length; // Contar número de estrellas
            totalEstrellas += numeroEstrellas;
        });

        // Calcular el promedio
        let promedio = (totalEstrellas / cantidadComentarios).toFixed(1); // Redondear a 1 decimal

        // Asegurar que el promedio no supere 5
        promedio = Math.min(promedio, 5);

        // Mostrar el promedio de calificación
        document.getElementById('average-rating').textContent = `Promedio de calificación: ${'⭐'.repeat(Math.round(promedio))} (${promedio} de 5)`;
    }

    // Llamar a la función para calcular el promedio cuando cargue la página
    calcularPromedioCalificaciones();