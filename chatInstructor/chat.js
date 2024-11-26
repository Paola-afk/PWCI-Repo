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




document.addEventListener('DOMContentLoaded', () => {
    const chatList = document.getElementById('chatList'); // Contenedor de la lista de chats
    const currentChatName = document.getElementById('currentChatName');
    const currentChatAvatar = document.getElementById('currentChatAvatar');
    const chatMessages = document.getElementById('chatMessages');

    function cargarChats() {
        fetch('../backend/API-Mensajes/mensaje-instructor.php') // Cambia esto por la ruta a tu archivo PHP
            .then(response => response.json())
            .then(data => {
                chatList.innerHTML = ''; // Limpiamos la lista

                data.forEach(estudiante => {
                    const chatItem = document.createElement('div');
                    chatItem.classList.add('chat-item');
                    chatItem.setAttribute('data-chat-id', estudiante.ID_Usuario); // Guardamos el ID del estudiante

                    chatItem.innerHTML = `
                        <img src="${estudiante.Avatar}" alt="Avatar" class="avatar">
                        <div class="chat-info">
                            <h4 class="chat-name">${estudiante.Nombre_Completo}</h4>
                        </div>
                    `;

                    // Evento para cargar los mensajes al hacer clic en un chat
                    chatItem.addEventListener('click', () => {
                        currentChatName.textContent = estudiante.Nombre_Completo;
                        currentChatAvatar.src = estudiante.Avatar;

                        // Lógica para cargar mensajes
                        loadMessages(estudiante.ID_Usuario);
                    });

                    chatList.appendChild(chatItem);
                });
            })
            .catch(error => console.error('Error al cargar los chats:', error));
    }

    function loadMessages(chatId) {
        // Aquí puedes hacer otra solicitud para obtener los mensajes del estudiante con ID `chatId`
        console.log(`Cargando mensajes del chat con ID: ${chatId}`);
    }

    // Cargar chats al iniciar la página
    cargarChats();
});

