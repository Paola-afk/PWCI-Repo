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

//Navegacion para moverse entre las pestanas
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionamos todos los enlaces de la barra lateral
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');

    // Función para eliminar la clase 'active' de todos los enlaces
    function removeActiveClasses() {
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
        });
    }

    // Añadimos el evento de clic para cada enlace de la barra lateral
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Primero eliminamos la clase 'active' de todos los enlaces
            removeActiveClasses();

            // Añadimos la clase 'active' al enlace que fue clicado
            this.classList.add('active');
        });
    });

    // Ejemplo para las funciones que cambian el contenido dinámicamente
    document.getElementById('gestion-cursos-link').addEventListener('click', function() {
        // Mostrar las pestañas relacionadas con 'Gestión de cursos'
        document.getElementById('cursos-impartidos-tab').style.display = 'block';
        document.getElementById('crear-curso-tab').style.display = 'block';
       // document.getElementById('eliminar-curso-tab').style.display = 'block';
        
        // Ocultar las pestañas relacionadas con 'Ventas y reportes'
        document.getElementById('resumen-ventas-tab').style.display = 'none';
        document.getElementById('detalles-curso-tab').style.display = 'none';

    });

    document.getElementById('ventas-reportes-link').addEventListener('click', function() {
        // Mostrar las pestañas relacionadas con 'Ventas y reportes'
        document.getElementById('resumen-ventas-tab').style.display = 'block';
        document.getElementById('detalles-curso-tab').style.display = 'block';

        // Ocultar las pestañas relacionadas con 'Gestión de cursos'
        document.getElementById('cursos-impartidos-tab').style.display = 'none';
        document.getElementById('crear-curso-tab').style.display = 'none';

       // document.getElementById('eliminar-curso-tab').style.display = 'none';
    });

});


//Funcion para eliminar algun curso

// Selecciona todos los botones de eliminar
const eliminarBtns = document.querySelectorAll('.eliminar-curso-btn');

// Añade un evento 'click' para cada botón de eliminar
eliminarBtns.forEach(function(btn) {
    btn.addEventListener('click', function(event) {
        // Obtén la fila donde se encuentra el botón
        const row = event.target.closest('tr');

        // Muestra una alerta de confirmación
        const confirmacion = confirm("¿Estás seguro de que deseas eliminar este curso?");

        if (confirmacion) {
            // Si se confirma, elimina la fila visualmente
            row.style.transition = "opacity 0.5s ease"; // Transición suave para el efecto visual
            row.style.opacity = 0;  // Hace la fila transparente

            // Espera 500ms antes de eliminar el curso completamente y mostrar el mensaje
            setTimeout(function() {
                row.remove();
                alert("El curso ha sido eliminado con éxito.");
            }, 500); // 500ms de espera para que la transición ocurra primero
        } else {
            // Si el usuario cancela, simplemente no pasa nada
            alert("Acción cancelada.");
        }
    });
});

//Aplicar los filtords
/*
document.getElementById('aplicar-filtros').addEventListener('click', function() {
    // Captura los valores de los filtros
    const fechaInicio = document.getElementById('fecha-inicio').value;
    const fechaFin = document.getElementById('fecha-fin').value;
    const categoria = document.getElementById('categoria').value;
    const soloActivos = document.getElementById('solo-activos').checked;

    // Obtén todas las filas de la tabla
    const filas = document.querySelectorAll('#tabla-ventas .venta');

    filas.forEach(fila => {
        // Obtén los datos de cada fila
        const fechaCurso = fila.getAttribute('data-fecha');
        const categoriaCurso = fila.getAttribute('data-categoria');
        const activo = fila.getAttribute('data-activo') === 'sí';

        let mostrar = true;

        // Filtrar por fecha de inicio
        if (fechaInicio && new Date(fechaCurso) < new Date(fechaInicio)) {
            mostrar = false;
        }

        // Filtrar por fecha de fin
        if (fechaFin && new Date(fechaCurso) > new Date(fechaFin)) {
            mostrar = false;
        }

        // Filtrar por categoría
        if (categoria !== 'todas' && categoriaCurso !== categoria) {
            mostrar = false;
        }

        // Filtrar por solo cursos activos
        if (soloActivos && !activo) {
            mostrar = false;
        }

        // Muestra u oculta la fila según el filtro
        fila.style.display = mostrar ? '' : 'none';
    });

});
*/

let instructorId = null; // Variable para almacenar el ID del instructor


// Función para cargar las categorías en el formulario
function cargarCategorias() {
    fetch('/PWCI-Repo/backend/loadCategories.php')  // Cambia esta ruta si es necesario
    .then(response => response.json())
    .then(data => {
        const selectCategoria = document.getElementById("curso-categoria");

        // Limpiar las opciones anteriores (en caso de que haya)
        selectCategoria.innerHTML = '<option value="">Seleccionar categoría</option>';

        // Verificar si la respuesta contiene datos
        if (data && Array.isArray(data)) {
            data.forEach(categoria => {
                const option = document.createElement("option");
                option.value = categoria.ID_Categoria;
                option.textContent = categoria.Nombre_Categoria;
                selectCategoria.appendChild(option);
            });
        } else {
            console.error("No se encontraron categorías.");
        }
    })
    .catch(error => {
        console.error("Error al cargar las categorías: ", error);
    });
}

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    cargarCategorias();
});



    function cargarCursos(){
        fetch('http://localhost/PWCI-Repo/backend/API-Cursos/cursos.php')
            .then(response => response.json())
        .then(data => {
        const tbody = document.getElementById("cursos-impartidos-body");
        let contenido = "";
        data.cursosImpartidos.forEach(curso => {
            contenido += `
                <tr>
                    <td>${curso.Titulo}</td>
                    <td>${curso.Categoria}</td>
                    <td>${curso.Descripcion}</td>
                    <td>${curso.Estado}</td>
                    <td>
                        <button class="btn btn-info editar-curso-btn" data-id="${curso.ID_Curso}">Editar</button>
                        <button class="btn btn-danger eliminar-curso-btn" data-id="${curso.ID_Curso}">Eliminar</button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = contenido;
        })
        .catch(error => console.error('Error al cargar los cursos:', error));
    }



document.getElementById("create-course-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que se recargue la página al enviar el formulario

    // Crear un objeto FormData para manejar la subida de archivos
    var formData = new FormData(this);

    // Verificar si hay un archivo de imagen seleccionado y agregarlo al FormData
    var imagenFile = document.getElementById("curso-imagen").files[0];
    if (imagenFile) {
        formData.append("Imagen", imagenFile);
    }

    // Obtener el ID del usuario que está creando el curso desde la sesión
    fetch('../backend/get_session.php')
        .then(response => response.json())
        .then(sessionData => {
            if (sessionData.loggedIn) {
                // El usuario está autenticado, incluir el ID del instructor
                formData.append("ID_Instructor", sessionData["ID Usuario"]);

                // Enviar los datos al backend
                fetch('http://localhost/PWCI-Repo/backend/API-Cursos/cursos.php', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.message === "Curso creado con éxito") {
                            // Mostrar mensaje de éxito con SweetAlert
                            Swal.fire({
                                icon: 'success',
                                title: '¡Éxito!',
                                text: data.message,
                                confirmButtonText: 'Aceptar'
                            });
                            cargarCursos()
                        } else {
                            // Mostrar mensaje de error con SweetAlert
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: data.message || 'Ocurrió un error al crear el curso.',
                                confirmButtonText: 'Aceptar'
                            });
                        }
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error inesperado',
                            text: 'Hubo un problema al procesar la solicitud. Inténtalo de nuevo.',
                            confirmButtonText: 'Aceptar'
                        });
                    });
            } else {
                // Si el usuario no está autenticado
                Swal.fire({
                    icon: 'warning',
                    title: 'Inicia sesión',
                    text: 'Debes iniciar sesión para crear un curso.',
                    confirmButtonText: 'Aceptar'
                });
            }
        })
        .catch(error => {
            console.error("Error al verificar la sesión:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error inesperado',
                text: 'No se pudo verificar la sesión. Inténtalo de nuevo.',
                confirmButtonText: 'Aceptar'
            });
        });
});


document.addEventListener('DOMContentLoaded', cargarCursos);

// Manejar el clic en el botón "Eliminar" y realizar la baja lógica del curso
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('eliminar-curso-btn')) {
        const cursoId = e.target.getAttribute('data-id');

        // Confirmación antes de dar de baja el curso
        Swal.fire({
            title: '¿Estás seguro?',
            text: "El curso quedará inactivo.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, dar de baja',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Enviar la solicitud de baja lógica al backend
                fetch('http://localhost/PWCI-Repo/backend/API-Cursos/cursos.php', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `idCurso=${cursoId}`
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.message === "Curso dado de baja con éxito") {
                            Swal.fire({
                                icon: 'success',
                                title: '¡Hecho!',
                                text: data.message,
                                confirmButtonText: 'Aceptar'
                            });
                            cargarCursos(); // Recargar la tabla de cursos
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: data.message,
                                confirmButtonText: 'Aceptar'
                            });
                        }
                    })
                    .catch(error => {
                        console.error("Error al dar de baja el curso:", error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error inesperado',
                            text: 'No se pudo procesar la solicitud. Intenta nuevamente.',
                            confirmButtonText: 'Aceptar'
                        });
                    });
            }
        });
    }
});


// Manejar el clic en el botón "Editar" y llenar el formulario del modal
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('editar-curso-btn')) {
        const idCurso = e.target.getAttribute('data-id');
        const titulo = e.target.getAttribute('data-titulo');
        const descripcion = e.target.getAttribute('data-descripcion');
        const costo = e.target.getAttribute('data-costo');
        const nivel = e.target.getAttribute('data-nivel');

        // Llenar el formulario del modal con los datos del curso
        document.getElementById('idCurso').value = idCurso;
        document.getElementById('tituloCurso').value = titulo;
        document.getElementById('descripcionCurso').value = descripcion;
        document.getElementById('costoCurso').value = costo;
        document.getElementById('nivelCurso').value = nivel;

        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('modalEditarCurso'));
        modal.show();
    }
});

// Esta función cierra el modal
function closeModal() {
    // Asumimos que el modal tiene el id 'modalEditarCurso'
    const modal = document.getElementById('modalEditarCurso');
    modal.classList.remove('show');  // Elimina la clase 'show' para ocultarlo
    modal.style.display = 'none';    // Cambia el estilo directamente si es necesario
}


// Enviar los datos del formulario de editar curso
// Enviar los datos del formulario de editar curso
document.getElementById('formEditarCurso').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita la recarga de la página

    const form = e.target;
    const formData = new FormData(form);

    fetch('http://localhost/PWCI-Repo/backend/API-Cursos/cursos.php', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.text()) // Usamos 'text' para ver la respuesta cruda
    .then(data => {
        console.log(data); // Ver la respuesta cruda
        try {
            const jsonResponse = JSON.parse(data); // Intentamos parsear a JSON
            if (jsonResponse) {
                console.log(jsonResponse);
                // Usamos SweetAlert en lugar de alert
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: jsonResponse.message || "Curso actualizado con éxito",
                });
                cargarCursos();
                closeModal(); // Cierra el modal si todo salió bien
            } else {
                // Usamos SweetAlert para el error
                Swal.fire({
                    icon: 'error',
                    title: '¡Error!',
                    text: "Ocurrió un error al actualizar el curso",
                });
            }
        } catch (error) {
            console.error('Error al parsear el JSON:', error);
            // Usamos SweetAlert para el error inesperado
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: "Error inesperado, por favor inténtalo de nuevo",
            });
        }
    })
    .catch(error => {
        console.error("Error de red:", error);
        // Usamos SweetAlert para el error de red
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: "Error inesperado, por favor inténtalo de nuevo",
        });
    });
});



//Reportes y Ventas


document.addEventListener("DOMContentLoaded", function () {
    const cursoSelect = document.getElementById("curso-select");
    const tablaDetalles = document.getElementById("tablaDetalles");
    const totalIngresosCurso = document.getElementById("total-ingresos-curso");

    // Cargar cursos del instructor
    fetch('http://localhost/PWCI-Repo/backend/ventas/getCursosInstructor.php')
        .then(response => response.json())
        .then(data => {
            if (data.cursos && data.cursos.length > 0) {
                // Limpiar las opciones previas
                const select = document.getElementById('curso-select');
                select.innerHTML = '<option value="">Selecciona un curso</option>';

                // Agregar los cursos al dropdown
                data.cursos.forEach(curso => {
                    const option = document.createElement('option');
                    option.value = curso.ID_Curso;
                    option.textContent = curso.Titulo;
                    select.appendChild(option);
                });
            } else {
                console.error("No se encontraron cursos.");
            }
        })
        .catch(error => {
            console.error("Error al cargar los cursos:", error);
        });

    // Manejar el cambio en el select
    cursoSelect.addEventListener("change", function () {
        const idCurso = this.value;
        console.log("Curso seleccionado ID:", idCurso); // Verificar el valor

        if (!idCurso) {
            tablaDetalles.innerHTML = `<tr><td colspan="5">Selecciona un curso para ver los detalles.</td></tr>`;
            totalIngresosCurso.textContent = "$0.00 MXN";
            return;
        }

        // Obtener detalles del curso seleccionado
        fetch('http://localhost/PWCI-Repo/backend/ventas/getDetails.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idCurso })
        })
        .then(response => response.text())  // Cambiar a .text() para leer el cuerpo como texto
        .then(text => {
            console.log('Respuesta del servidor (texto):', text);  // Imprimir el texto de la respuesta
        
            // Intentar parsear como JSON
            try {
                const data = JSON.parse(text);
                if (data.error) {
                    alert(data.error);
                    return;
                }
        
                // Actualizar la tabla con los detalles del curso
                tablaDetalles.innerHTML = "";  // Limpiar tabla antes de agregar los nuevos detalles
                let totalIngresos = 0;
        
                if (data.detalles && data.detalles.length > 0) {
                    data.detalles.forEach(detalle => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${detalle.Nombre_Alumno ?? 'N/A'}</td>
                            <td>${detalle.Fecha_inscripcion ?? 'N/A'}</td>
                            <td>${detalle.Nivel_de_Avance ?? '0.00%'}</td>
                            <td>${(detalle.Precio_Pagado ?? 0).toLocaleString("es-MX", { style: "currency", currency: "MXN" })}</td>
                            <td>${detalle.Forma_Pago ?? 'Desconocida'}</td>
                        `;
                        totalIngresos += parseFloat(detalle.Precio_Pagado);
                        tablaDetalles.appendChild(row);
                    });
                } else {
                    tablaDetalles.innerHTML = `<tr><td colspan="5">No hay detalles disponibles para este curso.</td></tr>`;
                }
        
                // Mostrar total de ingresos
                totalIngresosCurso.textContent = totalIngresos.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
        
            } catch (error) {
                console.error("Error al parsear JSON:", error);
            }
        })
        .catch(error => {
            console.error("Error al obtener los detalles del curso:", error);
        });
        
    });
});
