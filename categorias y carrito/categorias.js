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



// Función para cargar las categorías desde el backend
async function cargarCategorias() {
    try {
        const response = await fetch("/PWCI-Repo/backend/getCategorias-Cursos.php")
        // Cambia esta URL si es necesario
        const data = await response.json();

        console.log("Datos recibidos:", data);

        // Selecciona el contenedor principal donde se agregarán las categorías
        const container = document.querySelector(".container-category");

        if (!container) {
            console.error("No se encontró el contenedor principal en el DOM.");
            return;
        }

        // Itera sobre cada categoría recibida
        data.forEach(category => {
            // Crea la sección para la categoría si no existe
            const section = document.createElement("section");
            section.classList.add("category");

            section.innerHTML = `
                <div class="category-header">${category.Nombre_Categoria}</div>
                <div class="slider">
                    <!-- Botón izquierdo -->
                    <button class="nav-btn left-btn" onclick="scrollLeft('slider${category.ID_Categoria}')">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    
                    <!-- Contenedor de los cursos -->
                    <div id="slider${category.ID_Categoria}" class="slider-content">
                        <!-- Cursos se añadirán aquí dinámicamente -->
                    </div>

                    <!-- Botón derecho -->
                    <button class="nav-btn right-btn" onclick="scrollRight('slider${category.ID_Categoria}')">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            `;

            // Agrega la sección al contenedor principal
            container.appendChild(section);

            // Selecciona el slider recién creado
            const sliderContent = document.getElementById(`slider${category.ID_Categoria}`);
            //<img src="${course.Imagen ? `http://localhost/PWCI-Repo/backend/API-Cursos/${course.Imagen}` : 'https://via.placeholder.com/500x150'}" alt="Imagen del curso style="width: 50px; height: 25px; object-fit: cover">

            // Añade los cursos de la categoría al slider
            category.Cursos.forEach(course => {
                const item = document.createElement("div");
                item.classList.add("slider-item");
                item.innerHTML = `
                    <a href="http://localhost/PWCI-Repo/MisCursos/cursoNA.html?id=${course.ID_Curso}" class="course-link">
                        <img src="${course.Imagen ? `http://localhost/PWCI-Repo/backend/API-Cursos/${course.Imagen}` : 'https://via.placeholder.com/500x150'}" alt="${course.Titulo}">
                        <p class="text-white text-center">${course.Titulo}</p>
                    </a>
                `;
                sliderContent.appendChild(item);
            });
        });
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
    }
}

// Funciones de scroll para los sliders
function scrollLeft(sliderId) {
    const slider = document.getElementById(sliderId);
    if (slider) {
        slider.scrollBy({ left: -300, behavior: "smooth" });
    }
}

function scrollRight(sliderId) {
    const slider = document.getElementById(sliderId);
    if (slider) {
        slider.scrollBy({ left: 300, behavior: "smooth" });
    }
}

// Llama a la función para cargar las categorías al cargar la página
document.addEventListener("DOMContentLoaded", cargarCategorias);
