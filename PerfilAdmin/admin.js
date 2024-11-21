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

    // Funciones de alerta para botones de acciones
    const buttonsBlock = document.querySelectorAll(".btn-warning");
    const buttonsDelete = document.querySelectorAll(".btn-danger");
    const buttonsEdit = document.querySelectorAll(".btn-secondary");

    buttonsBlock.forEach(button => {
        button.addEventListener("click", function () {
            alert("Usuario bloqueado.");
        });
    });

    // Simular la eliminación con confirmación
    buttonsDelete.forEach(button => {
        button.addEventListener("click", function () {
            const row = this.closest("tr"); // Obtener la fila más cercana
            const userName = row.querySelector("td:nth-child(2)").textContent; // Obtener el nombre del usuario

            // Mostrar confirmación antes de eliminar
            const confirmed = confirm(`¿Estás seguro de que quieres eliminar a ${userName}?`);

            if (confirmed) {
                row.remove(); // Eliminar la fila si se confirma
                alert(`${userName} ha sido eliminado.`);
            }
        });
    });

    buttonsEdit.forEach(button => {
        button.addEventListener("click", function () {
            alert("Editando categoría.");
        });
    });

    /*
    const addCategoryForm = document.getElementById("addCategoryForm");
    const categoryTableBody = document.querySelector("#gestionar-categorias tbody");
    
    // Contador para los IDs de las categorías
    let categoryIdCounter = 1;
    
    addCategoryForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar el envío del formulario
    
        const categoryNameInput = document.getElementById("category-name");
        const categoryName = categoryNameInput.value.trim();
    
        if (categoryName === "") {
            alert("El nombre de la categoría no puede estar vacío.");
            return;
        }
    
        // Confirmar la adición de la categoría
        const confirmed = confirm(`¿Estás seguro de que quieres agregar la categoría "${categoryName}"?`);
    
        if (confirmed) {
            // Agregar la nueva categoría a la tabla
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${categoryIdCounter++}</td>
                <td>${categoryName}</td>
                <td>
                    <button class="btn btn-secondary btn-sm">Editar</button>
                    <button class="btn btn-danger btn-sm">Eliminar</button>
                </td>
            `;
    
            categoryTableBody.appendChild(newRow);

        
    
            // Asignar eventos a los botones de la nueva fila
            const editButton = newRow.querySelector(".btn-secondary");
            const deleteButton = newRow.querySelector(".btn-danger");
    
            // Evento de editar
            editButton.addEventListener("click", function () {
                alert(`Editando categoría "${categoryName}".`);
            });
    
            // Evento de eliminar
            deleteButton.addEventListener("click", function () {
                const confirmedDelete = confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoryName}"?`);
                if (confirmedDelete) {
                    newRow.remove(); // Eliminar la fila si se confirma
                    alert(`Categoría "${categoryName}" ha sido eliminada.`);
                }
            });
    
            // Limpiar el campo de texto y cerrar el modal
            categoryNameInput.value = "";
            $('#addCategoryModal').modal('hide');
            alert(`Categoría "${categoryName}" ha sido agregada.`);
        }
        
    });
    */

    // Función que se ejecutará cuando el DOM esté listo
    $(document).ready(function() {
        // Función AJAX que se ejecuta al cargar la página
        loadCategorias();

        // Función para cargar las categorías
        function loadCategorias() {
            $.ajax({
                url: '/PWCI-Repo/backend/addCategories.php', // Archivo PHP que traerá las categorías
                type: 'GET',
                success: function(response) {
                    $('#categoriaTableBody').html(response); // Insertar los datos en la tabla
                },
                error: function() {
                    alert('Hubo un error al cargar las categorías');
                }
            });
        }
    });


    $(document).ready(function() {
        $('#addCategoryForm').on('submit', function(event) {
            event.preventDefault(); // Prevenir el envío tradicional del formulario
    
            var nombreCategoria = $('#category-name').val();
            var descripcion = $('#category-description').val();
    
            $.ajax({
                url: 'http://localhost/pwci-repo/backend/addCategory.php', // Ruta del archivo PHP
                type: 'POST',
                data: {
                    nombre_categoria: nombreCategoria,
                    descripcion: descripcion
                },
                success: function(response) {
                    var data = JSON.parse(response);
                    if (data.status === 'success') {
                        alert(data.message); // Mostrar mensaje de éxito
                        location.reload(); // Recargar la página para ver la nueva categoría
                    } else {
                        alert(data.message); // Mostrar mensaje de error (por ejemplo, categoría duplicada)
                    }
                },
                error: function() {
                    alert('Error al realizar la solicitud');
                }
            });
        });
    });
    
    
    

});

