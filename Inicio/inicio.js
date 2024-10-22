$_SESSION['rol'] = $rol;
$_SESSION['avatar'] = $avatar;  // Agregar el avatar
document.addEventListener("DOMContentLoaded", function() {
    fetch('/PWCI-Repo/backend/get_session.php')  // Llama al PHP que devuelve los datos de sesión
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                document.getElementById('userProfile').style.display = 'block';
                document.querySelector('.auth-buttons').style.display = 'none'; // Ocultar botones de iniciar sesión y registro
                document.querySelector('.avatar').src = data.avatar;  // Mostrar avatar

                // Filtrar menú según rol
                const profileMenu = document.getElementById('profileMenu');
                profileMenu.innerHTML = '';  // Limpiar el menú primero

                profileMenu.innerHTML += <a href="/PerfilUser/perfilUser.html">Ver Perfil</a>;
                if (data.rol == '1') {  // Estudiante
                    profileMenu.innerHTML += <a href="/MisCursos">Ver mis cursos</a>;
                } else if (data.rol == '2') {  // Instructor
                    profileMenu.innerHTML += <a href="/MisVentas">Ver mis ventas</a>;
                } else if (data.rol == '3') {  // Administrador
                    profileMenu.innerHTML += <a href="/Reportes">Ver reportes</a>;
                }
                profileMenu.innerHTML += <a href="/logIn/logIn.html">Cerrar sesión</a>;
            }
        })
        .catch(error => console.error('Error:', error));
});