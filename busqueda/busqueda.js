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




// Obtener referencias a los elementos
const searchForm = document.getElementById('searchForm');
const searchResults = document.getElementById('searchResults');
const categoriaFilter = document.getElementById('categoriaFilter');
const usuarioFilter = document.getElementById('usuarioFilter');

// Cargar filtros al iniciar la página
window.addEventListener('DOMContentLoaded', () => {
    fetchFilters();
});

// Escuchar el envío del formulario
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    fetchSearchResults();
});

// Función para cargar los filtros de categoría e instructor
function fetchFilters() {
    fetch('http://localhost/PWCI-Repo/backend/busquedas/filters.php')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar filtros');
        }
        return response.json();
        })
        .then(data => {
            // Cargar categorías
            categoriaFilter.innerHTML = '<option value="">Seleccionar Categoría</option>';
            data.categorias.forEach(categoria => {
                categoriaFilter.innerHTML += `<option value="${categoria.ID_Categoria}">${categoria.Nombre_Categoria}</option>`;
            });

            // Cargar usuarios
            usuarioFilter.innerHTML = '<option value="">Seleccionar Instructor</option>';
            data.usuarios.forEach(usuario => {
                usuarioFilter.innerHTML += `<option value="${usuario.ID_Usuario}">${usuario.Nombre_Completo}</option>`;
            });
        })
        .catch(error => {
            console.error('Error al obtener los filtros:', error);
        });

}

function fetchSearchResults() {
    const formData = new FormData(searchForm);

    // Depuración: Verificar qué datos se están enviando en formData
    formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    });

    console.log("searchQuery:", formData.get('q'));
    console.log("Instructor seleccionado:", formData.get('usuario'));
    //console.log("Fecha:", formData.get('fechaInicio'));
    console.log("Fecha Inicio:", formData.get('fechaInicio'));
    console.log("Fecha Fin:", formData.get('fechaFin'));


    fetch('http://localhost/PWCI-Repo/backend/busquedas/busqueda.php', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        searchResults.innerHTML = '';

        if (data.length > 0) {
            data.forEach(curso => {
                searchResults.innerHTML += `
                    <div class="course" style="background-color: #2f2f65">
                        <h3>${curso.Titulo}</h3>
                        <p>${curso.Descripcion}</p>
                        <p><strong>Instructor:</strong> ${curso.InstructorNombre}</p>
                        <p><strong>Fecha de creación:</strong> ${curso.Fecha_Creacion}</p>
                    </div>
                `;
            });
        } else {
            searchResults.innerHTML = '<p>No se encontraron resultados.</p>';
        }
    });
}
