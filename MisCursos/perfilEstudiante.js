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
    const courseList = document.getElementById("courseList");
    if (!courseList) {
        console.error("No se encontró el elemento con ID 'courseList'. Verifica tu HTML.");
        return; // Detener ejecución si no se encuentra el elemento
    }

    // Llamar al script PHP para obtener los cursos
    fetch("../backend/cursos/misCursos.php")
        .then(response => {
            if (!response.ok) throw new Error("Error al obtener los cursos");
            return response.json();
        })
        .then(data => {
            if (data.error) {
                courseList.innerHTML = `<p>${data.error}</p>`;
                return;
            }

            // Crear el contenido dinámico
            if (data.length > 0) {
                courseList.innerHTML = data.map(course => `
                    <div class="course" onclick="window.location.href='cursoA.html?id=${course.ID_Curso}';">
                        <img src="${course.Imagen || 'https://via.placeholder.com/500x150'}" alt="Imagen del curso">
                        <h3>${course.Titulo}</h3>
                        <p>Progreso: ${course.Progreso}%</p>
                    </div>
                `).join('');
            } else {
                courseList.innerHTML = `<p>No has comprado ningún curso aún.</p>`;
            }
        })
        .catch(error => {
            console.error("Error:", error);
            courseList.innerHTML = `<p>Error al cargar los cursos. Inténtalo más tarde.</p>`;
        });
});

function renderFilteredCourses(courses) {
    const courseList = document.getElementById('courseList');
    
    // Limpiar la lista de cursos actual
    courseList.innerHTML = '';

    if (courses.length === 0) {
        courseList.innerHTML = '<p>No se encontraron cursos con los filtros seleccionados.</p>';
        return;
    }

    // Recorrer los cursos filtrados y agregarlos al DOM
    courses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.classList.add('course');

        courseElement.innerHTML = `
            <img src="${course.Imagen ? course.Imagen : 'placeholder.png'}" alt="${course.Titulo}">
            <h3>${course.Titulo}</h3>
            <p>Progreso: ${course.Progreso}%</p>
        `;

        // Añadir evento para abrir el curso
        courseElement.addEventListener('click', () => {
            openCourse(course.Titulo); // Cambia esto según tu implementación
        });

        courseList.appendChild(courseElement);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    cargarCategorias();
});

function cargarCategorias() {
    fetch('http://localhost/PWCI-Repo/backend/getCategorias.php')
        .then(response => response.json())
        .then(data => {
            console.log('Categorías recibidas:', data); // Depura los datos que recibes

            const categoriaSelect = document.getElementById('filterCategory');
            
            // Limpia las opciones actuales
            categoriaSelect.innerHTML = '<option value="all">Todas</option>';
            
            // Verifica que los datos de categorías no estén vacíos
            if (data.length === 0) {
                categoriaSelect.innerHTML = '<option value="all">Sin categorías disponibles</option>';
            } else {
                data.forEach(categoria => {
                    const option = document.createElement('option');
                    option.value = categoria.ID_Categoria;
                    option.textContent = categoria.Nombre_Categoria; // Asegúrate de que el campo se llama Nombre_Categoria
                    categoriaSelect.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error al cargar las categorías:', error);
        });
}


document.getElementById('filterForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Obtener valores de los filtros
    const dateStart = document.getElementById('dateStart').value;
    const dateEnd = document.getElementById('dateEnd').value;
    const category = document.getElementById('filterCategory').value;
    console.log("Categoría seleccionada: ", category); 
    const status = document.getElementById('status').value;
    const active = document.getElementById('active').value;

    console.log(dateStart, dateEnd, category, status, active); // Solo para depuración

   // Verifica el valor de la categoría

    const filters = {
        dateStart: dateStart || null,
        dateEnd: dateEnd || null,
        category: category || 'all',
        status: status || 'all',
        active: active || 'all'
    };
    console.log(filters);
    //onsole.log("DATA", data['category']); 
    
    fetch('http://localhost/PWCI-Repo/backend/kardex/filterCursos.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        renderFilteredCourses(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
