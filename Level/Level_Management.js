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


// Función para verificar que el label 'for' coincida con el id del campo
function verificarLabelYSelect() {
    const label = document.querySelector('label[for="curso-select"]');
    const select = document.getElementById('curso-select');

    // Verificar si el label existe
    if (!label) {
        console.error('El <label> con for="curso-select" no existe en el DOM.');
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El <label> con for="curso-select" no existe en el DOM.'
        });
    } else {
        console.log('Etiqueta encontrada:', label);
    }

    // Verificar si el select existe
    if (!select) {
        console.error('El elemento con id="curso-select" no existe en el DOM.');
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El elemento con id="curso-select" no existe en el DOM.'
        });
    } else {
        console.log('Elemento select encontrado:', select);
    }

    // Verificar si el 'for' del label coincide con el id del select
    if (label && select && label.getAttribute('for') !== select.id) {
        console.error('El atributo for del label no coincide con el id del select.');
        Swal.fire({
            icon: 'error',
            title: 'Error de accesibilidad',
            text: 'El atributo "for" del <label> no coincide con el id del <select>. Esto puede afectar el autocompletado y la accesibilidad.'
        });
    }
}

// Llamar a la función después de que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', verificarLabelYSelect);

// Función para cargar dinámicamente las opciones del curso
function cargarOpcionesCursos() {
    fetch('http://localhost/PWCI-Repo/backend/API-Cursos/cursos.php')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById("curso-select");
            // Limpiar las opciones actuales antes de agregar nuevas
            select.innerHTML = '<option value="" disabled selected>Selecciona un curso</option>';

            // Agregar las opciones dinámicamente
            data.cursosImpartidos.forEach(curso => {
                const option = document.createElement('option');
                option.value = curso.ID_Curso;
                option.textContent = curso.Titulo;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al cargar las opciones del curso:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'Hubo un error al cargar las opciones del curso.'
            });
        });
}

// Llamada para cargar las opciones del curso cuando se carga el DOM
document.addEventListener('DOMContentLoaded', cargarOpcionesCursos);


/////niveles

// Función para cargar los niveles de un curso seleccionado
function cargarNiveles(cursoId) {
    console.log(`Cargando niveles para el curso con ID: ${cursoId}`); // Verifica el curso_id
    fetch(`http://localhost/PWCI-Repo/backend/niveles.php?curso_id=${cursoId}`)  // Usamos el curso_id dinámico
        .then(response => response.json())
        .then(data => {
            console.log('Datos de niveles recibidos:', data);  // Verifica los datos aquí

            const nivelesList = document.getElementById("niveles-list");
            nivelesList.innerHTML = '';  // Limpiar la tabla antes de agregar los niveles

            // Si el servidor responde con niveles
            if (data.niveles && data.niveles.length > 0) {
                data.niveles.forEach(nivel => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${nivel.ID_Nivel}</td>
                        <td>${nivel.Titulo}</td>
                        <td>${nivel.Contenido || 'No disponible'}</td>
                        <td>
                            <button class="btn btn-info btn-sm" onclick="editarNivel(${nivel.ID_Nivel})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarNivel(${nivel.ID_Nivel})">Eliminar</button>
                        </td>
                    `;
                    nivelesList.appendChild(row);
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'No hay niveles disponibles',
                    text: 'Este curso no tiene niveles asociados o los datos no pudieron cargarse correctamente.'
                });
            }
        })
        .catch(error => {
            console.error('Error al cargar los niveles:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de carga',
                text: 'Hubo un error al cargar los niveles del curso.'
            });
        });
}

// Evento cuando se selecciona un curso para cargar los niveles
document.getElementById('curso-select').addEventListener('change', function () {
    const cursoId = this.value;  // Obtenemos el ID del curso seleccionado
    if (cursoId) {
        cargarNiveles(cursoId);  // Cargar los niveles para el curso seleccionado
    }
});










function editarNivel(nivelId) {

    console.log('Tipo de input de video:', document.getElementById('nivel-video').type);
console.log('Valor de video:', document.getElementById('nivel-video').value);

    fetch(`http://localhost/PWCI-Repo/backend/niveles/nivelDetails.php?nivel_id=${nivelId}`)
        .then(response => response.json())
        .then(data => {
            console.log('Datos de niveles recibidos:', data);  
            if (data.nivel) {
                const nivel = data.nivel;
                document.getElementById('nivel-id').value = nivel.ID_Nivel;
                document.getElementById('nivel-titulo').value = nivel.Titulo;
                document.getElementById('nivel-contenido').value = nivel.Contenido || '';
                document.getElementById('nivel-video').value = nivel.Video || '';
                document.getElementById('nivel-documento').value = nivel.Documento || '';
                document.getElementById('nivel-estado').value = nivel.Estado || 'activo';
                document.getElementById('editarNivelModal').style.display = 'block';
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Nivel no encontrado',
                    text: 'No se pudo cargar la información del nivel.'
                });
            }
        })
        .catch(error => {
            console.error('Error al cargar el nivel:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al cargar los datos del nivel.'
            });
        });
}

document.getElementById('editarNivelForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const nivelId = document.getElementById('nivel-id').value;
    const titulo = document.getElementById('nivel-titulo').value;
    const contenido = document.getElementById('nivel-contenido').value;
    const videoInput = document.getElementById('nivel-video'); // Accedemos al input
    const video = videoInput.value; // Obtenemos el valor del video
    const documento = document.getElementById('nivel-documento').value;
    const estado = document.getElementById('nivel-estado').value;

    console.log('Tipo de input de video:', videoInput.type); // Esto debería imprimir "text"

    fetch('http://localhost/PWCI-Repo/backend/niveles/editarNivel.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            id: nivelId, 
            titulo, 
            contenido, 
            video, 
            documento, 
            estado 
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Nivel actualizado',
                    text: 'El nivel se actualizó correctamente.'
                });
                document.getElementById('editarNivelModal').style.display = 'none';
                cargarNiveles(document.getElementById('curso-select').value);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al actualizar el nivel.'
                });
            }
        })
        .catch(error => {
            console.error('Error al actualizar el nivel:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema en la conexión.'
            });
        });
});










function eliminarNivel(nivelId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esto eliminará el nivel de forma permanente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`http://localhost/PWCI-Repo/backend/eliminar_nivel.php?nivel_id=${nivelId}`, {
                method: 'DELETE'
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Eliminado',
                            text: 'El nivel ha sido eliminado con éxito.'
                        });
                        // Opcional: recargar la lista de niveles después de la eliminación
                        const cursoId = document.getElementById("curso-select").value;
                        cargarNiveles(cursoId);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: data.message || 'Hubo un problema al intentar eliminar el nivel.'
                        });
                    }
                })
                .catch(error => {
                    console.error('Error al eliminar el nivel:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al comunicarse con el servidor.'
                    });
                });
        }
    });
}
