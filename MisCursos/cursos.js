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



// Recuperar el ID del curso desde la URL
const urlParams = new URLSearchParams(window.location.search);
const cursoID = urlParams.get('id');

// Mostrar el ID en consola (para verificar)
console.log(cursoID);

// Aquí puedes usar el cursoID para hacer una solicitud y cargar los detalles del curso
fetch(`/PWCI-Repo/backend/cursos/getCursoDetails.php?id=${cursoID}`)
    .then(response => response.json())
    .then(curso => {
        if (curso) {
            console.log(curso); // Verifica los datos del curso

            // Mostrar los detalles del curso
            document.querySelector('#cursoTitulo').innerText = curso.Titulo || 'Título no disponible';
            document.querySelector('#cursoDescripcion').innerText = curso.Descripcion || 'Descripción no disponible';
            document.querySelector('#precio').innerText = `Adquirir por $${curso.Costo || '0.00'}`;
            document.querySelector('#cursoImagen').src = curso.Imagen || 'ruta_por_defecto.jpg';

            // Evento para agregar al carrito
            document.querySelector('#addCarrito').addEventListener('click', function () {
                // Crear un objeto con los detalles del curso
                const cursoCarrito = {
                    id: curso.ID_Curso,
                    titulo: curso.Titulo,
                    costo: curso.Costo,
                    imagen: curso.Imagen
                };

                // Obtener el carrito de compras del localStorage, si existe
                let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

                // Agregar el curso al carrito
                carrito.push(cursoCarrito);

                // Guardar el carrito actualizado en el localStorage
                localStorage.setItem('carrito', JSON.stringify(carrito));

                // Mensaje de confirmación
                alert('Curso agregado al carrito');
            });
        } else {
            console.error('No se encontró el curso');
        }
    })
    .catch(error => {
        console.error('Error al cargar los detalles del curso:', error);
    });

