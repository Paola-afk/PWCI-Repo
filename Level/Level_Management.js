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
                        <td>${nivel.id}</td>
                        <td>${nivel.titulo}</td>
                        <td>${nivel.contenido || 'No disponible'}</td>
                        <td>
                            <button class="btn btn-info btn-sm" onclick="editarNivel(${nivel.id})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarNivel(${nivel.id})">Eliminar</button>
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
