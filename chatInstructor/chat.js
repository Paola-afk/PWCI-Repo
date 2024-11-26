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



let mensajes = [];

document.addEventListener('DOMContentLoaded', () => {
    const chatList = document.getElementById('studentChatsList');
    const currentChatName = document.getElementById('currentChatName');
    const currentChatAvatar = document.getElementById('currentChatAvatar');
    const messagesContainer = document.getElementById('messages-container');
    const chatForm = document.getElementById('chatForm');
    const messageInput = chatForm.querySelector('input[type="text"]');
    const fileInput = chatForm.querySelector('input[type="file"]'); // Para manejar el archivo

    // Cargar la lista de chats
    function cargarChats() {
        fetch('../backend/API-Mensajes/get-chats.php')
            .then(response => response.json())
            .then(data => {
                chatList.innerHTML = ''; // Limpiar la lista

                data.forEach(estudiante => {
                    const chatItem = document.createElement('div');
                    chatItem.classList.add('chat-item', 'd-flex', 'align-items-center', 'p-2', 'mb-2', 'border', 'rounded');
                    chatItem.setAttribute('data-chat-id', estudiante.ID_Usuario); // ID del estudiante
                    chatItem.setAttribute('data-curso-id', estudiante.ID_Curso); // ID del curso

                    chatItem.innerHTML = `
                        <img src="${estudiante.Avatar ? `http://localhost/PWCI-Repo/backend/${estudiante.Avatar}` : 'default-avatar.jpg'}" alt="Avatar" class="chat-avatar me-2 rounded-circle" style="width: 40px; height: 40px;">
                        <span class="chat-name">${estudiante.Nombre_Completo}</span>
                    `;

                    chatItem.addEventListener('click', () => {

                        const chatsActivos = document.querySelectorAll('.chat-item.active');
                        chatsActivos.forEach(chat => chat.classList.remove('active'));
                        
                        // Marcar este chat como activo
                        chatItem.classList.add('active'); 

                        currentChatName.textContent = estudiante.Nombre_Completo;
                        currentChatAvatar.src = estudiante.Avatar ? `http://localhost/PWCI-Repo/backend/${estudiante.Avatar}` : 'default-avatar.jpg';
                        const destinatario_id = chatItem.getAttribute('data-chat-id');
                        const curso_id  = chatItem.getAttribute('data-curso-id');

                        if (destinatario_id && curso_id) {
                            loadMessages(destinatario_id, curso_id);
                        }
                    });

                    chatList.appendChild(chatItem);
                });
            })
            .catch(error => console.error('Error al cargar los chats:', error));
    }

    // Cargar los mensajes del chat seleccionado
    function loadMessages(destinatario_id, id_curso) {
        fetch(`../backend/API-Mensajes/get-mensajes.php?destinatario_id=${destinatario_id}&id_curso=${id_curso}`)
            .then(response => response.json())
            .then(data => {
                mensajes = data;
                messagesContainer.innerHTML = '';

                mensajes.forEach(mensaje => {
                    const messageItem = document.createElement('div');
                    messageItem.classList.add('chat-message', mensaje.Tipo === 'Estudiante' ? 'student' : 'instructor', 'd-flex', 'align-items-start', 'mb-3');

                    const avatarImg = document.createElement('img');
                    avatarImg.classList.add('avatar', 'me-3', 'rounded-circle');
                    avatarImg.src = mensaje.Avatar ? `http://localhost/PWCI-Repo/backend/${mensaje.Avatar}` : 'default-avatar.jpg';
                    avatarImg.alt = 'Avatar';
                    avatarImg.style.width = '40px';
                    avatarImg.style.height = '40px';

                    const messageContent = document.createElement('div');
                    messageContent.classList.add('message-content', 'p-2', 'rounded');
                    messageContent.style.backgroundColor = mensaje.Tipo === 'Estudiante' ? '#9F88FF' : '#7B6FE7';
                    messageContent.style.color = mensaje.Tipo === 'Estudiante' ? '#232346' : '#E8EAF6';
                    messageContent.textContent = mensaje.Mensaje;

                    const timestamp = document.createElement('div');
                    timestamp.classList.add('timestamp', 'text-muted', 'small', 'mt-1');
                    timestamp.style.color = '#E8EAF6';
                    timestamp.textContent = new Date(mensaje.Fecha_envio).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

                    messageItem.appendChild(avatarImg);
                    messageItem.appendChild(messageContent);
                    messageItem.appendChild(timestamp);

                    messagesContainer.appendChild(messageItem);
                });

                // Desplazar hacia abajo para ver el mensaje más reciente
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            })
            .catch(error => console.error('Error al cargar los mensajes:', error));
    }

    // Manejar el envío del formulario para enviar un mensaje
    chatForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
        
        const mensaje = messageInput.value.trim();
        const file = fileInput.files[0]; // Obtener archivo si existe

        if (!mensaje && !file) return; // No enviar si no hay mensaje ni archivo

        const chatId = chatList.querySelector('.chat-item.active')?.getAttribute('data-chat-id');
        const cursoId = chatList.querySelector('.chat-item.active')?.getAttribute('data-curso-id');

        if (!chatId || !cursoId) {
            alert('Selecciona un chat para enviar un mensaje.');
            return;
        }

        const formData = new FormData();
        formData.append('destinatario_id', chatId);
        formData.append('id_curso', cursoId);
        formData.append('mensaje', mensaje);
        if (file) {
            formData.append('archivo', file);
        }

        // Enviar el mensaje con AJAX
        fetch('../backend/API-Mensajes/send-mensajes.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadMessages(cursoId, chatId);  // Llamar a la función para recargar los mensajes
                messageInput.value = '';  // Limpiar el campo de mensaje
                fileInput.value = '';  // Limpiar el campo de archivo
            } else {
                console.error('Error al enviar el mensaje:', data.error);
            }
        })
        .catch(error => {
            console.error('Error al enviar el mensaje:', error);
        });
    });

    // Cargar los chats al inicio
    cargarChats();
});
