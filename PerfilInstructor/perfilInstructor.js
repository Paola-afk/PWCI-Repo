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
            }
        })
        .catch(error => console.error('Error:', error));
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
/*
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
/*
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
*/

/*
document.getElementById('create-course-form').addEventListener('submit', function (e) {
    /*e.preventDefault(); // Evita el envío estándar del formulario

    // Recopilar datos del formulario
    const formData = new FormData(this);

    // Enviar datos al servidor
    fetch('/api/cursos/crear', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Mostrar mensaje de éxito
                document.getElementById('success-message').style.display = 'block';
                document.getElementById('error-message').style.display = 'none';

                // Opcional: Limpiar el formulario
                this.reset();
            } else {
                // Mostrar mensaje de error
                document.getElementById('success-message').style.display = 'none';
                document.getElementById('error-message').style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('success-message').style.display = 'none';
            document.getElementById('error-message').style.display = 'block';
        });
        
});
*/


document.getElementById("create-course-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita que se recargue la página al enviar el formulario

    // Crear un objeto FormData para manejar la subida de archivos
    var formData = new FormData(this);

    // Verificar si hay un archivo de imagen seleccionado y agregarlo al FormData
    var imagenFile = document.getElementById("curso-imagen").files[0];
    if (imagenFile) {
        formData.append("Imagen", imagenFile);
    }

    // Obtener el ID del usuario que está creando el curso desde la sesión
    fetch('../backend/get_session.php')
        .then(response => response.json())
        .then(sessionData => {
            if (sessionData.loggedIn) {
                // El usuario está autenticado, incluir el ID del instructor
                formData.append("ID_Instructor", sessionData["ID Usuario"]);

                // Enviar los datos al backend
                fetch('http://localhost/PWCI-Repo/backend/API-Cursos/cursos.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message === "Curso creado con éxito") {
                        // Mostrar mensaje de éxito
                        document.getElementById("success-message").style.display = "block";
                        document.getElementById("error-message").style.display = "none";
                    } else {
                        // Mostrar mensaje de error
                        document.getElementById("error-message").style.display = "block";
                        document.getElementById("success-message").style.display = "none";
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    document.getElementById("error-message").style.display = "block";
                    document.getElementById("success-message").style.display = "none";
                });
            } else {
                // Si el usuario no está autenticado
                alert("Debes iniciar sesión para crear un curso.");
            }
        })
        .catch(error => {
            console.error("Error al verificar la sesión:", error);
        });
});

