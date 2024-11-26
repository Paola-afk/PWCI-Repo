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
    // Elementos principales del DOM
    const chatList = document.getElementById('studentChatsList');
    const currentChatName = document.getElementById('currentChatName');
    const currentChatAvatar = document.getElementById('currentChatAvatar');
    const messagesContainer = document.getElementById('messages-container');
    const chatForm = document.getElementById('chatForm');
    const messageInput = chatForm.querySelector('input[type="text"]');

    // Cargar lista de chats
    function cargarChats() {
        fetch('../backend/API-Mensajes/get-chats.php') // Cambia esto por la ruta a tu archivo PHP
            .then(response => response.json())
            .then(data => {
                chatList.innerHTML = ''; // Limpiar la lista

                data.forEach(estudiante => {
                    const chatItem = document.createElement('div');
                    chatItem.classList.add('chat-item', 'd-flex', 'align-items-center', 'p-2', 'mb-2', 'border', 'rounded');
                    chatItem.setAttribute('data-chat-id', estudiante.ID_Usuario); // Asegúrate de que este ID sea el del estudiante
                    chatItem.setAttribute('data-curso-id', estudiante.ID_Curso); // Este es el ID del curso

                    chatItem.innerHTML = `
                        <img src="${estudiante.Avatar ? `http://localhost/PWCI-Repo/backend/${estudiante.Avatar}` : 'default-avatar.jpg'}" alt="Avatar" class="chat-avatar me-2 rounded-circle" style="width: 40px; height: 40px;">
                        <span class="chat-name">${estudiante.Nombre_Completo}</span>
                    `;

                    // Evento para cargar los mensajes al hacer clic en un chat
                    chatItem.addEventListener('click', () => {
                        currentChatName.textContent = estudiante.Nombre_Completo;
                        currentChatAvatar.src = estudiante.Avatar ? `http://localhost/PWCI-Repo/backend/${estudiante.Avatar}` : 'default-avatar.jpg';;

                        const destinatario_id = chatItem.getAttribute('data-chat-id');
                        const curso_id  = chatItem.getAttribute('data-curso-id');

                        console.log(`Cargando mensajes para estudiante ID: ${destinatario_id}, curso ID: ${curso_id}`);

                        if (destinatario_id && curso_id) {
                            loadMessages(destinatario_id, curso_id); // Solo llama a la función si ambos parámetros son válidos
                        } else {
                            console.error("Faltan parámetros obligatorios");
                        }
                    });

                    chatList.appendChild(chatItem);
                });
            })
            .catch(error => console.error('Error al cargar los chats:', error));
    }

    // Cargar mensajes de un chat específico
    function loadMessages(destinatario_id, id_curso) {
        // Verificar los parámetros antes de hacer la solicitud
        console.log('Parametros enviados:', { destinatario_id, id_curso });

        fetch(`../backend/API-Mensajes/get-mensajes.php?destinatario_id=${destinatario_id}&id_curso=${id_curso}`)
            .then(response => response.json())  // Esto convierte la respuesta a JSON
            .then(data => {
                console.log(data); // Verifica el tipo de 'data' en la consola
                if (Array.isArray(data)) {
                    mensajes = data; // Ahora puedes usar forEach
                } else {
                    console.error('La respuesta no es un arreglo:', data);
                }

                messagesContainer.innerHTML = ''; // Limpiar los mensajes previos

                mensajes.forEach(mensaje => {
                    const messageItem = document.createElement('div');
                    messageItem.classList.add('chat-message', mensaje.Tipo === 'Estudiante' ? 'student' : 'instructor', 'd-flex', 'align-items-start', 'mb-3');

                    // Crear el avatar
                    const avatarImg = document.createElement('img');
                    avatarImg.classList.add('avatar', 'me-3', 'rounded-circle');
                    avatarImg.src = mensaje.Avatar ? `http://localhost/PWCI-Repo/backend/${mensaje.Avatar}` : 'default-avatar.jpg';
                    avatarImg.alt = 'Avatar';
                    avatarImg.style.width = '40px';
                    avatarImg.style.height = '40px';

                    // Crear el contenido del mensaje
                    const messageContent = document.createElement('div');
                    messageContent.classList.add('message-content', 'p-2', 'rounded');
                    messageContent.style.backgroundColor = mensaje.Tipo === 'Estudiante' ? '#9F88FF' : '#7B6FE7'; // Diferenciar por tipo
                    messageContent.style.color = mensaje.Tipo === 'Estudiante' ? '#232346' : '#E8EAF6';
                    messageContent.textContent = mensaje.Mensaje;

                    // Crear la fecha del mensaje
                    const timestamp = document.createElement('div');
                    timestamp.classList.add('timestamp', 'text-muted', 'small', 'mt-1');
                    timestamp.style.color = '#E8EAF6';
                    timestamp.textContent = new Date(mensaje.Fecha_envio).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

                    // Armar el mensaje completo
                    messageItem.appendChild(avatarImg);
                    messageItem.appendChild(messageContent);
                    messageItem.appendChild(timestamp);

                    // Añadir el mensaje al contenedor
                    messagesContainer.appendChild(messageItem);
                });
            })
            .catch(error => console.error('Error al cargar los mensajes:', error));
    }

    // Enviar mensaje
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const mensaje = messageInput.value.trim();
        if (!mensaje) return; // No enviar mensajes vacíos

        const chatId = chatList.querySelector('.chat-item.active')?.getAttribute('data-chat-id');
        if (!chatId) {
            alert('Selecciona un chat para enviar un mensaje.');
            return;
        }

        fetch('../backend/API-Mensajes/send-mensajes.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, mensaje })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadMessages(chatId); // Refrescar mensajes
                    messageInput.value = ''; // Limpiar input
                } else {
                    console.error('Error al enviar el mensaje:', data.error);
                }
            })
            .catch(error => console.error('Error al enviar el mensaje:', error));
    });

    // Cargar chats al inicio
    cargarChats();
});
