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

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM completamente cargado. Iniciando carga de cursos...");

    // Cargar cursos mejor calificados
    fetchCursos('topRated', 'topRatedCourses');

    // Cargar cursos más vendidos
    fetchCursos('mostSold', 'mostSoldCourses');

    // Cargar cursos más recientes
    fetchCursos('mostRecent', 'recentCourses');
});

function fetchCursos(tipo, containerId) {
    console.log(`Iniciando fetch para tipo: ${tipo} en contenedor: ${containerId}`);

    fetch(`http://localhost/PWCI-Repo/backend/getcursosT.php?tipo=${tipo}`)
        .then(response => {
            console.log(`Respuesta recibida para tipo: ${tipo} - Estado: ${response.status}`);
            
            if (!response.ok) {
                console.error(`Error en la respuesta del servidor para tipo: ${tipo}`);
                alert(`Error en la respuesta del servidor para tipo: ${tipo}`);
                throw new Error(`Error en la respuesta del servidor: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`Datos recibidos para tipo: ${tipo}`, data); // Verifica la respuesta aquí

            const coursesContainer = document.getElementById(containerId);

            if (!coursesContainer) {
                console.error(`No se encontró el contenedor con ID: ${containerId}`);
                alert(`Error: No se encontró el contenedor con ID: ${containerId}`);
                return;
            }

            if (data.length === 0) {
                console.warn(`No se encontraron cursos disponibles para tipo: ${tipo}`);
                coursesContainer.innerHTML = '<p>No se encontraron cursos disponibles.</p>';
            } else {
                console.log(`Mostrando ${data.length} cursos para tipo: ${tipo}`);
                coursesContainer.innerHTML = ''; // Limpia cualquier contenido previo
                data.forEach(curso => {
                    // Actualizamos la construcción de la URL de la imagen
                    const rutaImagen = curso.Imagen.startsWith('http') 
                        ? curso.Imagen 
                        : `http://localhost/PWCI-Repo/backend/API-Cursos/${curso.Imagen}`;

                    console.log(`Ruta de la imagen para el curso "${curso.Titulo}":`, rutaImagen);

                    coursesContainer.innerHTML += `
                        <div class="course-card">
                            <img src="${rutaImagen}" alt="${curso.Titulo}" onerror="this.src='default-image.jpg';">
                            <h3>${curso.Titulo}</h3>
                            <p>${curso.Descripcion}</p>
                            <p><strong>Calificación promedio:</strong> ${curso.Promedio_Calificacion !== undefined ? curso.Promedio_Calificacion.toFixed(2) : 'N/A'}</p>
                            <a href="http://localhost/PWCI-Repo/MisCursos/cursoNA.html?id=${curso.ID_Curso}" class="btn">Ver más</a>
                        </div>
                    `;
                });
            }
        })
        .catch(error => {
            console.error(`Hubo un problema con la solicitud para tipo: ${tipo}`, error);
            alert(`Hubo un problema con la solicitud para tipo: ${tipo}`);
        });
}
