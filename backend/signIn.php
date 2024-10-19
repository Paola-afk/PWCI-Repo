<?php 
include 'conexion.php'; // Conexión a la base de datos

// Incluir SweetAlert al inicio del archivo
echo '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Obtener y sanitizar los datos del formulario
    $nombre_completo = mysqli_real_escape_string($conn, $_POST['name']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $contrasena = mysqli_real_escape_string($conn, $_POST['password']);
    $genero = (int)$_POST['genero'];
    $fecha_nacimiento = mysqli_real_escape_string($conn, $_POST['fecha-nacimiento']);
    $rol = (int)$_POST['role'];

    // Validaciones del servidor
    if (empty($nombre_completo) || empty($email) || empty($contrasena) || empty($genero) || empty($fecha_nacimiento) || empty($rol)) {
        echo "<script>
            window.onload = function() {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Todos los campos son obligatorios.',
                    confirmButtonText: 'Aceptar'
                }).then(function() {
                    window.location.href = '../SignIn/signIn.html';
                });
            };
        </script>";
        exit();
    }

    // Validación de correo electrónico
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "<script>
            window.onload = function() {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Correo electrónico no válido.',
                    confirmButtonText: 'Aceptar'
                }).then(function() {
                    window.location.href = '../SignIn/signIn.html';
                });
            };
        </script>";
        exit();
    }

    // Validación de la contraseña
    $passwordRegex = '/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/';
    if (!preg_match($passwordRegex, $contrasena)) {
        echo "<script>
            window.onload = function() {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.',
                    confirmButtonText: 'Aceptar'
                }).then(function() {
                    window.location.href = '../SignIn/signIn.html';
                });
            };
        </script>";
        exit();
    }

    // Encriptar la contraseña
    $contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);

    // Subir avatar (opcional)
    $avatar_destino = '';
    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
        $avatar = $_FILES['avatar']['name'];
        $avatar_tmp = $_FILES['avatar']['tmp_name'];
        $avatar_destino = 'uploads/' . basename($avatar);
        if (!move_uploaded_file($avatar_tmp, $avatar_destino)) {
            echo "<script>
                window.onload = function() {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al subir el avatar.',
                        confirmButtonText: 'Aceptar'
                    }).then(function() {
                    window.location.href = '../SignIn/signIn.html';
                });
                };
            </script>";
            exit();
        }
    }

    // Preparar la consulta para llamar al Stored Procedure
    $stmt = $conn->prepare("CALL sp_registrar_usuario(?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $nombre_completo, $email, $contrasena_hash, $genero, $fecha_nacimiento, $avatar_destino, $rol);

    // Ejecutar y manejar errores
    if ($stmt->execute()) {
        echo "<script>
            window.onload = function() {
                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    text: 'Te has registrado correctamente',
                    confirmButtonText: 'Continuar'
                }).then(function() {
                    window.location.href = '../logIn/logIn.html';
                });
            };
        </script>";
    } else {
        echo "<script>
            window.onload = function() {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al registrar usuario: " . $stmt->error . "',
                    confirmButtonText: 'Aceptar'
                }).then(function() {
                    window.location.href = '../SignIn/signIn.html';
                });
            };
        </script>";
    }

    // Cerrar la conexión
    $stmt->close();
    $conn->close();
}
?>
