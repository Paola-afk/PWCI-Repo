document.addEventListener("DOMContentLoaded", function() {
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
                document.querySelector('.avatar').src = data.avatar;

                // Filtrar el menú por rol de usuario
                const profileMenu = document.getElementById('profileMenu');
                profileMenu.innerHTML = '';  // Limpiar el menú actual

                // Mostrar elementos según el rol del usuario
                if (data.rol == 1) {  // Estudiante
                    profileMenu.innerHTML += '<a href="/PerfilUser/perfilUser.html">Ver Perfil</a>';
                    profileMenu.innerHTML += '<a href="/MisCursos/perfilEstudiante.html">Ver mis cursos</a>';
                    profileMenu.innerHTML += '<a href="/logIn/logIn.html">Cerrar sesión</a>';
                } else if (data.rol == 2) {  // Instructor
                    profileMenu.innerHTML += '<a href="/PerfilUser/perfilUser.html">Ver Perfil</a>';
                    profileMenu.innerHTML += '<a href="/PerfilInstructor/perfilInstructor.html">Ver mis ventas</a>';
                    profileMenu.innerHTML += '<a href="/logIn/logIn.html">Cerrar sesión</a>';
                } else if (data.rol == 3) {  // Administrador
                    profileMenu.innerHTML += '<a href="/PerfilUser/perfilUser.html">Ver Perfil</a>';
                    profileMenu.innerHTML += '<a href="/PerfilAdmin/admin.html">Ver reportes</a>';
                    profileMenu.innerHTML += '<a href="/logIn/logIn.html">Cerrar sesión</a>';
                }
            }
        })
        .catch(error => console.error('Error:', error));
});
