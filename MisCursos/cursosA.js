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

let curso; 

// Función para cargar el curso desde la API
function cargarCurso() {
    fetch(apiUrl)
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(data => {
            curso = data; 
            // Actualizar el título y la descripción del curso
            document.getElementById("curso-titulo").textContent = data.Titulo;
            document.getElementById("curso-descripcion").textContent = data.Descripcion;

            // Cargar el progreso
            document.getElementById("progreso-bar").style.width = `${data.Progreso}%`;
            document.getElementById("progreso-text").textContent = `Has completado el ${data.Progreso}% del curso`;

             // Mostrar el botón de certificado si el progreso es 100%
            if (data.Progreso === 100) {
                document.getElementById("certificado-section").style.display = "block";
            }


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





async function cargarMensajes(idCurso) {
    try {
        // Realizar la solicitud GET para obtener los mensajes del curso
        const response = await fetch(`../backend/API-Mensajes/mensajes.php?id_curso=${idCurso}`);
        
        if (!response.ok) {
            throw new Error('Error al obtener los mensajes');
        }

        const data = await response.json();
        console.log(data);
        
        if (data.success) {
            const mensajes = data.mensajes;

            // Obtener el contenedor de los mensajes y el encabezado del chat
            const chatContainer = document.getElementById('chatWindow'); 
            const mensajesContainer = chatContainer.querySelector('.p-3'); 
            const instructorNameElement = document.getElementById('instructorName'); // Elemento para mostrar el nombre del instructor

            // Limpiar el contenedor de mensajes antes de agregar los nuevos
            mensajesContainer.innerHTML = '';

            // Agregar los mensajes al contenedor
            mensajes.forEach(mensaje => {
                const mensajeElement = document.createElement('div');
                mensajeElement.classList.add('p-2', 'mb-2', 'rounded-lg', 'flex', 'items-start', 'space-x-2');

                // Dependiendo de quién sea el remitente, se aplica la clase correspondiente
                if (mensaje.ID_Remitente === mensaje.ID_Destinatario) {
                    // Mensaje del instructor
                    mensajeElement.classList.add('bg-[var(--primario)]', 'text-[var(--fondo)]');
                } else {
                    // Mensaje del estudiante
                    mensajeElement.classList.add('bg-[var(--acento)]', 'text-[var(--fondo)]');
                }

                // Obtener la imagen del remitente (puedes agregar más lógica si es necesario)
                //const avatarUrl = mensaje.Imagen ? `../${mensaje.Imagen}` : 'default-avatar.jpg'; // Si no tiene avatar, mostrar uno por defecto
                // Suponiendo que 'mensaje' es el objeto que recibes de la respuesta PHP

                const avatarUrl = mensaje.Avatar ? `http://localhost/PWCI-Repo/backend/uploads/${mensaje.Avatar}` : 'default-avatar.jpg';


                // Crear el contenido del mensaje
                mensajeElement.innerHTML = `
                    <img src="${mensaje.Avatar ? `http://localhost/PWCI-Repo/backend/uploads/${mensaje.Avatar}` : 'default-avatar.jpg'}" alt="Avatar" class="w-8 h-8 rounded-full mr-2">
                    <div>
                        <p><strong>${mensaje.Nombre_Completo}:</strong> ${mensaje.Mensaje}</p>
                        <span class="text-sm text-gray-300">${mensaje.Fecha_envio}</span>
                    </div>
                `;

                // Agregar el mensaje al contenedor de mensajes
                mensajesContainer.appendChild(mensajeElement);
            });

            // Si quieres mostrar el nombre del instructor al principio del chat
            instructorNameElement.innerText = "Instructor: " + data.instructorName; // Suponiendo que el nombre del instructor es parte de la respuesta
        } else {
            console.error('Error al cargar mensajes:', data.error);
        }
    } catch (error) {
        console.error('Error en la solicitud de mensajes:', error);
    }
}




document.getElementById('chatButton').addEventListener('click', function() {
    // Llama a la función para cargar los mensajes
    cargarMensajes(courseId); 
    // Mostrar la ventana del chat
    document.getElementById('chatWindow').style.display = 'block';
});












document.getElementById('formMensaje').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita el comportamiento por defecto del formulario

    const mensaje = document.getElementById('mensaje').value.trim(); // Obtener el valor del mensaje
    const archivo = document.getElementById('archivoAdjunto').files[0]; // Obtener el archivo (si se adjunta)
    const idCurso = new URLSearchParams(window.location.search).get('id'); // Obtener el ID del curso desde la URL

    // Verificar que 'curso' esté cargado
    if (!curso) {
        console.error('Detalles del curso no cargados');
        return;
    }

    const idDestinatario = curso.ID_Instructor; // ID del instructor

    if (!idCurso) {
        console.error('ID del curso no disponible');
        return;
    }
    if (!mensaje) {
        console.error('El mensaje no puede estar vacío');
        return;
    }

    console.log("Datos enviados:");
    console.log("ID Curso:", idCurso);
    console.log("ID Destinatario:", idDestinatario);
    console.log("Mensaje:", mensaje);
    console.log("Archivo:", archivo ? archivo.name : 'Ningún archivo adjunto');

    // Obtener el ID del usuario autenticado
    let idUsuario;
    try {
        const response = await fetch('/PWCI-Repo/backend/get_session.php');
        if (!response.ok) {
            throw new Error('Error al obtener los datos de sesión');
        }
        const sessionData = await response.json();
        idUsuario = sessionData.ID_Usuario;  // Aquí cambiamos a 'ID_Usuario' en lugar de 'id_usuario'
        if (!idUsuario) {
            throw new Error('No se encontró el ID de usuario');
        }
    } catch (error) {
        console.error('Error en la sesión:', error);
        return;
    }

    // Crear un objeto FormData para manejar los datos del formulario
    const formData = new FormData();
    formData.append('mensaje', mensaje);
    formData.append('id_remitente', idUsuario);  // Usar el ID del usuario autenticado
    formData.append('id_destinatario', idDestinatario);  // El ID del destinatario (Instructor)
    formData.append('id_curso', idCurso);  // ID del curso
    if (archivo) formData.append('archivo', archivo);  // Solo agregar archivo si existe

    try {
        const sendMessageResponse = await fetch('../backend/API-Mensajes/mensajes.php', {
            method: 'POST',
            body: formData,
        });

        if (!sendMessageResponse.ok) {
            throw new Error('Error al enviar el mensaje');
        }

        const sendMessageData = await sendMessageResponse.json();
        if (sendMessageData.success) {
            console.log('Mensaje enviado correctamente:', sendMessageData);

            // Actualiza el chat sin recargar la página
            cargarMensajes(idCurso);
            document.getElementById('mensaje').value = ''; // Limpia el textarea
        } else {
            console.error('Error al enviar mensaje:', sendMessageData.error);
        }
    } catch (error) {
        console.error('Error en la solicitud de mensaje:', error);
    }
});









