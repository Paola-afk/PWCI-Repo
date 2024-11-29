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

document.addEventListener("DOMContentLoaded", function () {
    const sidebarLinks = document.querySelectorAll(".sidebar .nav-link");
    const sections = document.querySelectorAll(".admin-section");

    // Función para mostrar la sección correspondiente y ocultar las demás
    function showSection(sectionId) {
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.style.display = "block";
            } else {
                section.style.display = "none";
            }
        });
    }

    // Evento para cada link del sidebar
    sidebarLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const targetSection = this.getAttribute("data-target");

            // Marcar la opción seleccionada como activa
            sidebarLinks.forEach(link => link.classList.remove("active"));
            this.classList.add("active");

            // Mostrar la sección correspondiente
            showSection(targetSection);
        });
    });

    // Mostrar la primera sección por defecto
    showSection("gestionar-usuarios");




    // Función que se ejecutará cuando el DOM esté listo
    $(document).ready(function() {
        // Función para cargar las categorías
        loadCategorias();
    
        function loadCategorias() {
            $.ajax({
                url: '/PWCI-Repo/backend/loadCategories.php', // Archivo PHP que traerá las categorías
                type: 'GET',
                success: function(response) {
                    const categorias = JSON.parse(response); // Convertir el JSON a un objeto
    
                    // Limpiar la tabla antes de agregar los datos
                    $('#categoriaTableBody').empty();
    
                    // Recorrer las categorías y agregar las filas a la tabla
                    categorias.forEach(function(categoria) {
                        const row = `<tr>
                            <td>${categoria.Nombre_Categoria}</td>
                            <td>${categoria.Descripcion}</td>
                            <td>
                                <button class='btn btn-secondary btn-sm edit-category' data-id='${categoria.ID_Categoria}' data-name='${categoria.Nombre_Categoria}' data-description='${categoria.Descripcion}'>Editar</button>
                                <button class='btn btn-danger btn-sm delete-category' data-id='${categoria.ID_Categoria}'>Eliminar</button>
                            </td>
                        </tr>`;
                        $('#categoriaTableBody').append(row); // Agregar la fila a la tabla
                    });
                },
                error: function() {
                    alert('Hubo un error al cargar las categorías');
                }
            });
        }



        $('#addCategoryForm').on('submit', function (event) {
            event.preventDefault();
        
            $.ajax({
                url: '/PWCI-Repo/backend/addCategory.php',
                type: 'POST',
                data: $(this).serialize(),
                dataType: 'json',
                success: function(response) {
                    console.log(response); // Verifica lo que devuelve el servidor
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Éxito!',
                            text: response.message
                        }).then(() => {
                            //loadCategorias(); // Actualiza las categorías en la tabla
                            $('#addCategoryModal').modal('hide');
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.message
                        });
                    }
                },
                error: function(xhr, status, error) {
                    console.error("Error en la solicitud AJAX:", xhr.responseText);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error en la solicitud',
                        text: `Hubo un problema al realizar la solicitud: ${error}`
                    });
                }
            });
        });




        // Evento para el botón de editar categoría
        $(document).on('click', '.edit-category', function() {
            const idCategoria = $(this).data('id');
            const nombreCategoria = $(this).data('name');
            const descripcion = $(this).data('description');

            // Llenar los campos del formulario de edición con los datos actuales
            $('#edit-category-name').val(nombreCategoria);
            $('#edit-category-description').val(descripcion);
            $('#editCategoryModal').modal('show');

            // Guardar los cambios al enviar el formulario de edición
            $('#editCategoryForm').data('id_categoria', idCategoria); // Usamos data para guardar el id de la categoría
        });

        // Evento para el formulario de edición
        $('#editCategoryForm').on('submit', function(e) {
            e.preventDefault(); // Evitar el comportamiento por defecto
        
            const idCategoria = $(this).data('id_categoria');
            const newName = $('#edit-category-name').val().trim();  // Capturar valor del campo de nombre
            const newDescription = $('#edit-category-description').val().trim();  // Capturar valor del campo de descripción
        
            // Verificar que los valores se están capturando correctamente
            console.log("ID Categoria:", idCategoria); // Verificar que el id está correcto
            console.log("Nuevo Nombre:", newName);    // Verificar que el nombre es el correcto
            console.log("Nueva Descripción:", newDescription); // Verificar que la descripción es correcta
        
            // Enviar los datos al servidor
            $.ajax({
                url: '/PWCI-Repo/backend/editCategory.php', // Archivo PHP para editar categoría
                type: 'POST',
                data: {
                    id_categoria: idCategoria,
                    nombre_categoria: newName,
                    descripcion: newDescription
                },
                success: function(response) {
                    console.log("Respuesta del servidor:", response); // Verifica lo que devuelve el servidor
                    alert(response); // Mostrar el mensaje de éxito
                    $('#editCategoryModal').modal('hide'); // Cerrar el modal
                    loadCategorias(); // Recargar las categorías
                },
                error: function() {
                    alert('Hubo un error al editar la categoría');
                }
            });
        });
});
    
});

fetch('http://localhost/PWCI-Repo/backend/gestion_usuarios.php')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('tabla-usuarios');
            tbody.innerHTML = ''; // Limpiar cualquier contenido previo

            data.forEach(usuario => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${usuario.ID_Usuario}</td>
                    <td>${usuario.Nombre_Completo}</td>
                    <td>${usuario.ID_Rol}</td>
                    <td>
                        <button class='btn btn-warning btn-sm'>Bloquear</button>
                        <button class='btn btn-danger btn-sm'>Eliminar</button>
                    </td>
                `;

                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error al cargar los usuarios:', error));

document.addEventListener('DOMContentLoaded', () => {
            loadReport('instructores');
            loadReport('estudiantes');
        
            document.querySelectorAll('.tab-link').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    const reportType = e.target.id === 'instructor-tab' ? 'instructores' : 'estudiantes';
                    loadReport(reportType);
                });
            });
        });
        
        function loadReport(reportType) {
            fetch(`http://localhost/PWCI-Repo/backend/reportes.php?report_type=${reportType}`)
                .then(response => response.json())
                .then(data => {
                    const tbodyId = reportType === 'instructores' ? 'instructor-table-body' : 'student-table-body';
                    const tbody = document.getElementById(tbodyId);
                    tbody.innerHTML = '';
        
                    data.forEach(item => {
                        const row = document.createElement('tr');
        
                        if (reportType === 'instructores') {
                            row.innerHTML = `
                                <td>${item.Usuario}</td>
                                <td>${item.Nombre_Completo}</td>
                                <td>${item.Fecha_Ingreso}</td>
                                <td>${item.Cantidad_Cursos_Ofrecidos}</td>
                                <td>${item.Total_Ganancias}</td>
                            `;
                        } else {
                            row.innerHTML = `
                                <td>${item.Usuario}</td>
                                <td>${item.Nombre_Completo}</td>
                                <td>${item.Fecha_Ingreso}</td>
                                <td>${item.Cantidad_Cursos_Inscritos}</td>
                                <td>${item.Porcentaje_Cursos_Terminados}%</td>
                            `;
                        }
        
                        tbody.appendChild(row);
                    });
                })
                .catch(error => console.error('Error al cargar los reportes:', error));
        }
        
