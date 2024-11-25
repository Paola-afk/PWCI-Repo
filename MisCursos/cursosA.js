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




const params = new URLSearchParams(window.location.search);
const courseId = params.get("id");

// URL de la API que devuelve los datos del curso y niveles
const apiUrl = `../backend/cursos/myCourseDetails.php?id=${courseId}`;

// Función para cargar el curso desde la API
function cargarCurso() {
    fetch(apiUrl)
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(data => {
            // Actualizar el título y la descripción del curso
            document.getElementById("curso-titulo").textContent = data.Titulo;
            document.getElementById("curso-descripcion").textContent = data.Descripcion;

            // Cargar el progreso
            document.getElementById("progreso-bar").style.width = `${data.Progreso}%`;
            document.getElementById("progreso-text").textContent = `Has completado el ${data.Progreso}% del curso`;

            // Llamar a la función para cargar los niveles
            cargarNiveles(data.Niveles);
        })
        .catch(error => {
            console.error('Error al cargar el curso:', error);
        });
}

// Función para cargar los niveles
function cargarNiveles(niveles) {
    const nivelesContainer = document.getElementById("niveles");
    
    // Limpiar los niveles actuales (por si se vuelve a cargar)
    nivelesContainer.innerHTML = '';


    niveles.forEach((nivel, index) => {
        const nivelDiv = document.createElement("div");
        nivelDiv.classList.add("mb-8");

        // Encabezado del nivel: "Nivel 1", "Nivel 2", etc.
        const nivelEncabezado = document.createElement("h2");
        nivelEncabezado.classList.add("text-2xl", "font-bold", "text-[#E8EAF6]", "mb-4");
        nivelEncabezado.textContent = `Nivel ${index + 1}`;
        nivelDiv.appendChild(nivelEncabezado);

        // Nombre del nivel
        const nivelTitulo = document.createElement("h3");
        nivelTitulo.classList.add("text-xl", "font-semibold", "text-[#E8EAF6]", "mb-2");
        nivelTitulo.textContent = nivel.Nombre;
        nivelDiv.appendChild(nivelTitulo);

        const ul = document.createElement("ul");
        ul.classList.add("space-y-4");

        // Contenido principal
        if (nivel.Contenido) {
            const liContenido = document.createElement("li");
            liContenido.classList.add("bg-[#9F88FF]", "p-4", "rounded-lg");

            const contenidoTitulo = document.createElement("h4");
            contenidoTitulo.classList.add("text-lg", "font-bold", "text-[#333366]");
            contenidoTitulo.textContent = `Contenido: ${nivel.Contenido}`;
            liContenido.appendChild(contenidoTitulo);

            ul.appendChild(liContenido);
        }

        // Video
        const liVideo = document.createElement("li");
        liVideo.classList.add("bg-[#E8EAF6]", "p-4", "rounded-lg");

        const videoTitulo = document.createElement("h4");
        videoTitulo.classList.add("text-lg", "font-bold", "text-[#333366]");
        videoTitulo.textContent = `Video: ${nivel.Video || "No disponible"}`;
        liVideo.appendChild(videoTitulo);

        ul.appendChild(liVideo);

        // Documento
        const liDocumento = document.createElement("li");
        liDocumento.classList.add("bg-[#E8EAF6]", "p-4", "rounded-lg");

        const documentoTitulo = document.createElement("h4");
        documentoTitulo.classList.add("text-lg", "font-bold", "text-[#333366]");
        documentoTitulo.textContent = `Documento: ${nivel.Documento || "No disponible"}`;
        liDocumento.appendChild(documentoTitulo);

        ul.appendChild(liDocumento);

        nivelDiv.appendChild(ul);
        nivelesContainer.appendChild(nivelDiv);
    });
}

// Llamamos la función para cargar el curso
cargarCurso();



/*
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
    // Actualizar los datos básicos del curso
    document.querySelector(".curso-tarjeta h2").textContent = course.Titulo || "Título no disponible";
    document.querySelector(".curso-tarjeta p").textContent = course.Descripcion || "Descripción no disponible.";

    // Corregimos el selector con caracteres especiales para la imagen
    const imageElement = document.querySelector(".curso-tarjeta .bg-\\[\\#9F88FF\\]");
    if (imageElement) {
        imageElement.style.backgroundImage = `url('${course.Imagen || 'https://via.placeholder.com/500x150'}')`;
    }

    // Actualizar barra de progreso
    document.querySelector(".bg-green-500").style.width = `${course.Progreso || 0}%`;
    document.querySelector(".text-sm").textContent = `Has completado el ${course.Progreso || 0}% del curso`;

    // Renderizar niveles
    const nivelesContainer = document.querySelector(".bg-\\[\\#7B6FE7\\]");
    nivelesContainer.innerHTML = `
        <h2 class="text-2xl font-bold text-[#5D3FD3] mb-4">Contenido del Curso</h2>
    `;

    // Validamos que los niveles sean un arreglo
    if (Array.isArray(course.Niveles) && course.Niveles.length > 0) {
        nivelesContainer.innerHTML += course.Niveles.map(nivel => `
            <div class="mb-8">
                <h3 class="text-xl font-semibold text-[#E8EAF6] mb-2">${nivel.Titulo || "Nivel sin título"}</h3>
                <ul class="space-y-4">
                    ${nivel.Contenido ? `
                        <li class="bg-[#9F88FF] p-4 rounded-lg">
                            <h4 class="text-lg font-bold text-[#333366]">Contenido</h4>
                            <p class="text-[#5D3FD3]">${nivel.Contenido}</p>
                        </li>
                    ` : ''}
                    ${nivel.Video ? `
                        <li class="bg-[#9F88FF] p-4 rounded-lg">
                            <h4 class="text-lg font-bold text-[#333366]">Video</h4>
                            <a href="${nivel.Video}" class="text-[#5D3FD3] underline" target="_blank">Ver Video</a>
                        </li>
                    ` : ''}
                    ${nivel.Documento ? `
                        <li class="bg-[#9F88FF] p-4 rounded-lg">
                            <h4 class="text-lg font-bold text-[#333366]">Documento</h4>
                            <a href="${nivel.Documento}" class="text-[#5D3FD3] underline" target="_blank">Descargar Documento</a>
                        </li>
                    ` : ''}
                </ul>
            </div>
        `).join('');
    } else {
        nivelesContainer.innerHTML += "<p class='text-[#E8EAF6]'>No hay niveles disponibles para este curso.</p>";
    }
}
*/