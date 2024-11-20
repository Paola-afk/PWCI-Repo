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

//Navegacion para moverse entre las pestanas
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionamos todos los enlaces de la barra lateral
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');

    // Función para eliminar la clase 'active' de todos los enlaces
    function removeActiveClasses() {
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
        });
    }

    // Añadimos el evento de clic para cada enlace de la barra lateral
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Primero eliminamos la clase 'active' de todos los enlaces
            removeActiveClasses();

            // Añadimos la clase 'active' al enlace que fue clicado
            this.classList.add('active');
        });
    });

    // Ejemplo para las funciones que cambian el contenido dinámicamente
    document.getElementById('gestion-cursos-link').addEventListener('click', function() {
        // Mostrar las pestañas relacionadas con 'Gestión de cursos'
        document.getElementById('cursos-impartidos-tab').style.display = 'block';
        document.getElementById('crear-curso-tab').style.display = 'block';
       // document.getElementById('eliminar-curso-tab').style.display = 'block';
        
        // Ocultar las pestañas relacionadas con 'Ventas y reportes'
        document.getElementById('resumen-ventas-tab').style.display = 'none';
        document.getElementById('detalles-curso-tab').style.display = 'none';
    });

    document.getElementById('ventas-reportes-link').addEventListener('click', function() {
        // Mostrar las pestañas relacionadas con 'Ventas y reportes'
        document.getElementById('resumen-ventas-tab').style.display = 'block';
        document.getElementById('detalles-curso-tab').style.display = 'block';

        // Ocultar las pestañas relacionadas con 'Gestión de cursos'
        document.getElementById('cursos-impartidos-tab').style.display = 'none';
        document.getElementById('crear-curso-tab').style.display = 'none';
       // document.getElementById('eliminar-curso-tab').style.display = 'none';
    });
});


//Funcion para eliminar algun curso

// Selecciona todos los botones de eliminar
const eliminarBtns = document.querySelectorAll('.eliminar-curso-btn');

// Añade un evento 'click' para cada botón de eliminar
eliminarBtns.forEach(function(btn) {
    btn.addEventListener('click', function(event) {
        // Obtén la fila donde se encuentra el botón
        const row = event.target.closest('tr');

        // Muestra una alerta de confirmación
        const confirmacion = confirm("¿Estás seguro de que deseas eliminar este curso?");

        if (confirmacion) {
            // Si se confirma, elimina la fila visualmente
            row.style.transition = "opacity 0.5s ease"; // Transición suave para el efecto visual
            row.style.opacity = 0;  // Hace la fila transparente

            // Espera 500ms antes de eliminar el curso completamente y mostrar el mensaje
            setTimeout(function() {
                row.remove();
                alert("El curso ha sido eliminado con éxito.");
            }, 500); // 500ms de espera para que la transición ocurra primero
        } else {
            // Si el usuario cancela, simplemente no pasa nada
            alert("Acción cancelada.");
        }
    });
});

//Aplicar los filtords
document.getElementById('aplicar-filtros').addEventListener('click', function() {
    // Captura los valores de los filtros
    const fechaInicio = document.getElementById('fecha-inicio').value;
    const fechaFin = document.getElementById('fecha-fin').value;
    const categoria = document.getElementById('categoria').value;
    const soloActivos = document.getElementById('solo-activos').checked;

    // Obtén todas las filas de la tabla
    const filas = document.querySelectorAll('#tabla-ventas .venta');

    filas.forEach(fila => {
        // Obtén los datos de cada fila
        const fechaCurso = fila.getAttribute('data-fecha');
        const categoriaCurso = fila.getAttribute('data-categoria');
        const activo = fila.getAttribute('data-activo') === 'sí';

        let mostrar = true;

        // Filtrar por fecha de inicio
        if (fechaInicio && new Date(fechaCurso) < new Date(fechaInicio)) {
            mostrar = false;
        }

        // Filtrar por fecha de fin
        if (fechaFin && new Date(fechaCurso) > new Date(fechaFin)) {
            mostrar = false;
        }

        // Filtrar por categoría
        if (categoria !== 'todas' && categoriaCurso !== categoria) {
            mostrar = false;
        }

        // Filtrar por solo cursos activos
        if (soloActivos && !activo) {
            mostrar = false;
        }

        // Muestra u oculta la fila según el filtro
        fila.style.display = mostrar ? '' : 'none';
    });

});

let instructorId = null; // Variable para almacenar el ID del instructor

// Obtener datos de la sesión al cargar la página
fetch('getsession.php')
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            instructorId = data['ID Usuario']; // Almacenar el ID del instructor
        } else {
            // Redirigir al login si no está autenticado
            window.location.href = "login.php";
        }
    })
    .catch(error => console.error('Error al obtener la sesión:', error));

// Evento para enviar el formulario
document.getElementById("create-course-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar el envío real del formulario

    const createButton = document.getElementById("create-course-btn");
    createButton.disabled = true;
    createButton.innerText = "Creando...";

    const formData = new FormData();
    formData.append("ID_Instructor", instructorId); // Usar el ID del instructor de la sesión
    formData.append("Titulo", document.getElementById("curso-titulo").value);
    formData.append("Descripcion", document.getElementById("curso-descripcion").value);
    formData.append("Imagen", document.getElementById("curso-imagen").files[0]); 
    formData.append("Costo", document.getElementById("curso-costo").value);
    formData.append("Nivel", document.getElementById("curso-nivel").value);
    formData.append("Estado", document.getElementById("curso-estado").value);

    fetch('subir_curso.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Curso creado exitosamente!',
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error al crear el curso',
                text: data.message
            });
        }
        createButton.disabled = false;
        createButton.innerText = "Crear Curso";
    })
    .catch(error => {
        console.error("Error:", error);
        Swal.fire({
            icon: 'error',
            title: 'Hubo un error al intentar crear el curso.',
            text: 'Por favor, inténtelo de nuevo más tarde.'
        });
        createButton.disabled = false;
        createButton.innerText = "Crear Curso";
    });
});
