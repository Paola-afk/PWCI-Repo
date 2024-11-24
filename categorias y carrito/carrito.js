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
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carritoLista.innerHTML = "";

    if (carrito.length === 0) {
        carritoLista.innerHTML = `<li class="py-4 text-center text-gray-500">Tu carrito está vacío</li>`;
        totalDisplay.textContent = "0.00";
        return;
    }

    let total = 0;

    carrito.forEach((curso, index) => {
        const costo = parseFloat(curso.costo);
        total += costo;

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

    totalDisplay.textContent = total.toFixed(2);
}

// Agregar curso al carrito
function agregarCursoAlCarrito(curso) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(curso);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    cargarCarrito();

    Swal.fire({
        title: '¡Curso agregado!',
        text: `El curso "${curso.titulo}" ha sido añadido al carrito.`,
        icon: 'success',
        confirmButtonText: 'Continuar'
    });
}


function agregarAlCarrito(event) {
    event.preventDefault();

    // Verificar si se seleccionó un método de pago
    const paymentMethod = document.getElementById('payment-method').value;
    if (!paymentMethod) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor selecciona un método de pago.',
            icon: 'error',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    // Obtener los datos específicos del método de pago
    let paymentDetails = {};
    if (paymentMethod === 'tarjeta') {
        paymentDetails = {
            nombreTarjeta: document.getElementById('nombreTarjeta').value,
            numeroTarjeta: document.getElementById('numeroTarjeta').value,
            fechaExpiracion: document.getElementById('fechaExpiracion').value,
            cvv: document.getElementById('cvv').value
        };
    } else if (paymentMethod === 'paypal') {
        paymentDetails = {
            emailPaypal: document.getElementById('emailPaypal').value
        };
    } else if (paymentMethod === 'transferencia') {
        paymentDetails = {
            nombreBanco: document.getElementById('nombreBanco').value,
            numCuenta: document.getElementById('numCuenta').value
        };
    }

    // Validar que los términos y condiciones se hayan aceptado
    if (!document.getElementById('terms').checked) {
        Swal.fire({
            title: 'Error',
            text: 'Debes aceptar los términos y condiciones.',
            icon: 'error',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    // Obtener los cursos del carrito
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        Swal.fire({
            title: 'Carrito vacío',
            text: 'No tienes cursos en el carrito',
            icon: 'error',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    // Calcular el total pagado
    const totalPagado = carrito.reduce((total, curso) => total + parseFloat(curso.costo), 0);

    // Preparar los datos para enviar al backend
    const data = {
        cursos: carrito.map(curso => curso.id),
        totalPagado: totalPagado,
        formaPago: paymentMethod,
        paymentDetails: paymentDetails // Detalles del método de pago
    };

    // Enviar los datos al backend
    fetch('../backend/cursos/buyCurso.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    title: '¡Compra exitosa!',
                    text: 'Los cursos han sido adquiridos exitosamente.',
                    icon: 'success',
                    confirmButtonText: 'Ir a mis cursos'
                }).then(() => {
                    localStorage.removeItem('carrito'); // Limpiar el carrito
                    //window.location.href = '/MisCursos/perfilEstudiante.html';
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.error || 'Hubo un problema al procesar tu compra.',
                    icon: 'error',
                    confirmButtonText: 'Entendido'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al procesar tu compra.',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        });
}




// Eliminar curso del carrito
function eliminarDelCarrito(index) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
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



/*
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


function agregarAlCarrito(event) {
    event.preventDefault(); // Evitar la acción por defecto del botón si es un formulario

    // Obtener el carrito desde localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) {
        alert('No tienes cursos en el carrito');
        return;
    }

    // Realizar la solicitud al backend para procesar la compra
    fetch('../backend/cursos/buyCurso.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cursos: carrito }) // Enviar los cursos del carrito al backend
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Compra exitosa');
            localStorage.removeItem('carrito'); // Limpiar el carrito después de la compra
            window.location.href = '/MisCursos/perfilEstudiante.html';
        } else {
            alert('Error en la compra');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema al procesar tu compra');
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

*/

