document.addEventListener("DOMContentLoaded", function() {
    // Verifica si los elementos están presentes en el DOM
    const profileMenuToggle = document.getElementById('profileMenuToggle');
    const profileMenu = document.getElementById('profileMenu');

    console.log("profileMenuToggle:", profileMenuToggle);
    console.log("profileMenu:", profileMenu);

    if (!profileMenuToggle || !profileMenu) {
        console.error("Los elementos necesarios (#profileMenuToggle, #profileMenu) no están en el DOM.");
        return; // Salimos si faltan elementos
    }

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
        .then(response => {
            console.log("Fetch Response:", response); // Verifica si la respuesta es correcta
            return response.json();
        })
        .then(data => {
            console.log("Session Data:", data); // Verifica los datos de la sesión

            if (data.loggedIn) {
                // Ocultar botones de iniciar sesión y registro
                const authButtons = document.querySelector('.auth-buttons');
                const userProfile = document.getElementById('userProfile');

                if (authButtons) authButtons.style.display = 'none';
                if (userProfile) userProfile.style.display = 'block';

                // Establecer avatar del usuario
                const avatar = document.querySelector('.avatar');
                if (avatar) {
                    avatar.src = 'http://localhost/PWCI-Repo/backend/' + data.avatar;
                }

                // Filtrar el menú por rol de usuario
                if (profileMenu) {
                    profileMenu.innerHTML = ''; // Limpiar el menú actual

                    // Mostrar elementos según el rol del usuario
                    if (data.rol == 1) { // Estudiante
                        profileMenu.innerHTML += '<a href="http://localhost/PWCI-Repo/PerfilUser/perfilUser.html">Ver Perfil</a>';
                        profileMenu.innerHTML += '<a href="http://localhost/PWCI-Repo/MisCursos/perfilEstudiante.html">Ver mis cursos</a>';
                        profileMenu.innerHTML += '<a href="http://localhost/PWCI-Repo/logIn/logIn.html">Cerrar sesión</a>';
                    } else if (data.rol == 2) { // Instructor
                        profileMenu.innerHTML += '<a href="http://localhost/PWCI-Repo/PerfilUser/perfilUser.html">Ver Perfil</a>';
                        profileMenu.innerHTML += '<a href="http://localhost/PWCI-Repo/PerfilInstructor/perfilInstructor.html">Ver mis ventas</a>';
                        profileMenu.innerHTML += '<a href="http://localhost/PWCI-Repo/logIn/logIn.html">Cerrar sesión</a>';
                    } else if (data.rol == 3) { // Administrador
                        profileMenu.innerHTML += '<a href="http://localhost/PWCI-Repo/PerfilUser/perfilUser.html">Ver Perfil</a>';
                        profileMenu.innerHTML += '<a href="http://localhost/PWCI-Repo/PerfilAdmin/admin.html">Ver reportes</a>';
                        profileMenu.innerHTML += '<a href="http://localhost/PWCI-Repo/logIn/logIn.html">Cerrar sesión</a>';
                    }
                }
            }
        })
        .catch(error => console.error('Error:', error));
});



document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id");

    console.log(courseId);

    if (!courseId) {
        alert("No se proporcionó un ID de curso.");
        return;
    }

    // Llamar a la API para obtener los detalles del curso
    fetch(`../backend/cursos/myCourseDetails.php?id=${courseId}`)
        .then(response => {
            if (!response.ok) throw new Error("Error al obtener los detalles del curso.");
            return response.json();
        })
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }

            // Mostrar los detalles del curso
            renderCourseDetails(data);
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Hubo un problema al cargar los detalles del curso.");
        });
});

// Función para renderizar los detalles del curso en el HTML
function renderCourseDetails(course) {
    document.querySelector(".curso-tarjeta h2").textContent = course.Titulo;
    document.querySelector(".curso-tarjeta p").textContent = course.Descripcion;
    document.querySelector(".curso-tarjeta .bg-[#9F88FF]").style.backgroundImage = `url('${course.Imagen || 'https://via.placeholder.com/500x150'}')`;

    // Actualizar barra de progreso
    document.querySelector(".bg-green-500").style.width = `${course.Progreso}%`;
    document.querySelector(".text-sm").textContent = `Has completado el ${course.Progreso}% del curso`;

    // Renderizar niveles
    const nivelesContainer = document.querySelector(".bg-[#7B6FE7] .space-y-4");
    nivelesContainer.innerHTML = course.Niveles.map(nivel => `
        <div class="mb-8">
            <h3 class="text-xl font-semibold text-[#E8EAF6] mb-2">${nivel.Nombre}</h3>
            <ul class="space-y-4">
                ${nivel.Contenido.map(item => `
                    <li class="bg-[#9F88FF] p-4 rounded-lg">
                        <h4 class="text-lg font-bold text-[#333366]">${item.Nombre}</h4>
                        <a href="${item.Link}" class="text-[#5D3FD3] underline">${item.Tipo === 'Video' ? 'Ver Video' : 'Descargar'}</a>
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}
