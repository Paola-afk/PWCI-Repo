//Acciones al picar la foto del usuario en header
document.addEventListener("DOMContentLoaded", function() {
    const profileMenuToggle = document.getElementById('profileMenuToggle');
    const profileMenu = document.getElementById('profileMenu');

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


});

