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




const carritoLista = document.querySelector("#carritoLista");
const totalDisplay = document.querySelector("#totalDisplay");

// Cargar carrito desde localStorage
function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || []; // Obtener carrito o inicializar vacío

    carritoLista.innerHTML = ""; // Limpiar el contenido actual del carrito en el DOM

    // Mostrar mensaje si el carrito está vacío
    if (carrito.length === 0) {
        carritoLista.innerHTML = `<li class="py-4 text-center text-gray-500">Tu carrito está vacío</li>`;
        totalDisplay.textContent = "0.00";
        return;
    }

    let total = 0; // Para calcular el total

    // Iterar sobre los cursos del carrito
    carrito.forEach((curso, index) => {
        const costo = parseFloat(curso.costo); // Asegurar que costo sea numérico
        total += costo; // Sumar al total

        // Crear el elemento de lista para el curso
        const li = document.createElement("li");
        li.className = "flex justify-between items-center py-4";
        li.innerHTML = `
            <div class="flex items-center">
                <img src="${curso.imagen}" alt="${curso.titulo}" class="w-16 h-16 object-cover rounded mr-4">
                <div>
                    <h3 class="text-lg font-bold text-gray-700">${curso.titulo}</h3>
                </div>
            </div>
            <p class="text-lg font-bold text-[#4821ea]">$${costo.toFixed(2)}</p>
            <button class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600" onclick="eliminarDelCarrito(${index})">
                Eliminar
            </button>
        `;
        carritoLista.appendChild(li);
    });

    // Mostrar el total calculado
    totalDisplay.textContent = total.toFixed(2);
}


// Agregar curso al carrito
function agregarCursoAlCarrito(curso) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || []; // Obtener carrito o inicializar vacío

    // Agregar curso al carrito
    carrito.push(curso);

    // Guardar carrito actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Recargar la interfaz del carrito
    cargarCarrito();

    Swal.fire({
        title: '¡Curso agregado!',
        text: `El curso "${curso.titulo}" ha sido añadido al carrito.`,
        icon: 'success',
        confirmButtonText: 'Continuar'
    });
}

// Eliminar curso del carrito
function eliminarDelCarrito(index) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || []; // Obtener carrito o inicializar vacío

    // Eliminar el curso seleccionado
    carrito.splice(index, 1);

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Recargar la interfaz del carrito
    cargarCarrito();

    Swal.fire({
        title: 'Eliminado',
        text: 'El curso fue eliminado del carrito.',
        icon: 'success',
        confirmButtonText: 'Entendido'
    });
}

// Inicializar carrito en la pantalla
document.addEventListener('DOMContentLoaded', cargarCarrito);
