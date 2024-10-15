<?php
include 'conexion.php'; // Conexión a la base de datos

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Obtener y sanitizar los datos del formulario
    $nombre_completo = mysqli_real_escape_string($conn, $_POST['name']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $contrasena = mysqli_real_escape_string($conn, $_POST['password']);
    $genero = (int)$_POST['genero']; // Convertir a entero para ID_Genero
    $fecha_nacimiento = mysqli_real_escape_string($conn, $_POST['fecha-nacimiento']);
    $rol = (int)$_POST['role']; // Convertir a entero para ID_Rol

    // Validaciones del servidor
    if (empty($nombre_completo) || empty($email) || empty($contrasena) || empty($genero) || empty($fecha_nacimiento) || empty($rol)) {
        die("Todos los campos son obligatorios.");
    }

    // Validación de correo electrónico
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Correo electrónico no válido.");
    }

    // Encriptar la contraseña
    $contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);

    // Subir avatar (opcional)
    $avatar_destino = '';
    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
        $avatar = $_FILES['avatar']['name'];
        $avatar_tmp = $_FILES['avatar']['tmp_name'];
        $avatar_destino = 'uploads/' . basename($avatar); // Carpeta donde se guardará el avatar
        if (!move_uploaded_file($avatar_tmp, $avatar_destino)) {
            die("Error al subir el avatar.");
        }
    }

    // Preparar la consulta para llamar al Stored Procedure
    $stmt = $conn->prepare("CALL sp_registrar_usuario(?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $nombre_completo, $email, $contrasena_hash, $genero, $fecha_nacimiento, $avatar_destino, $rol);

    // Ejecutar y manejar errores
    if ($stmt->execute()) {
        echo "Registro exitoso.";
        header('Location: ../SignIn/signIn.html');
    } else {
        echo "Error al registrar usuario: " . $stmt->error;
    }

    // Cerrar la conexión
    $stmt->close();
    $conn->close();
}
?>
