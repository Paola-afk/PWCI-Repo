<?php
session_start();
include 'conexion.php'; // Conexión a la base de datos


header('Content-Type: application/json');

// Verificar si se ha enviado el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener los datos del formulario
    $id_usuario = $_SESSION['id_usuario']; // Suponiendo que tienes el ID del usuario en la sesión
    $nombre_completo = $_POST['nombre'];
    $email = $_POST['email'];
    $genero = $_POST['genero'];
    $fecha_nacimiento = $_POST['fechaNacimiento'];
    $contrasena = $_POST['contrasena'];

    // Validar los datos (puedes agregar más validaciones según sea necesario)
    if (empty($nombre_completo) || empty($email) || empty($genero) || empty($fecha_nacimiento)) {
        echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
        exit();
    }

    // Validar el formato del email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Correo electrónico no válido']);
        exit();
    }

    // Manejo del archivo de avatar (si se envía un archivo)
    $avatar_name = null;
    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
        $avatar = $_FILES['avatar'];
        $upload_dir = 'uploads/';
        
        // Generar un nombre único para el archivo
        $avatar_name = uniqid() . '_' . basename($avatar['name']);
        $upload_file = $upload_dir . $avatar_name;
        
        // Mover el archivo a la carpeta de uploads
        if (!move_uploaded_file($avatar['tmp_name'], $upload_file)) {
            echo json_encode(['success' => false, 'message' => 'Error al subir la imagen']);
            exit();
        }
    }

    try {
        // Iniciar transacción
        $conn->begin_transaction();

        // Si hay una nueva foto de avatar, actualizarla primero
        if ($avatar_name) {
            $sql = "CALL UpdateUsuarioAvatar(?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("is", $id_usuario, $avatar_name);

            if (!$stmt->execute()) {
                throw new Exception("Error al actualizar el avatar: " . $stmt->error);
            }

            // Actualizar el avatar en la sesión
            $_SESSION['avatar'] = $avatar_name;
        }

        // Preparar la llamada al procedimiento almacenado para actualizar el resto de los datos
        if (!empty($contrasena)) {
            // Si hay contraseña nueva, usar el procedimiento con contraseña
            $sql = "CALL UpdateUsuario(?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);

            // Encriptar la nueva contraseña
            $contrasena_hash = password_hash($contrasena, PASSWORD_BCRYPT);

            // Vincular parámetros
            $stmt->bind_param("isssss", $id_usuario, $nombre_completo, $email, $genero, $fecha_nacimiento, $contrasena_hash);
        } else {
            // Si no hay contraseña nueva, usar el procedimiento sin contraseña
            $sql = "CALL UpdateUsuarioSinPassword(?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("issss", $id_usuario, $nombre_completo, $email, $genero, $fecha_nacimiento);
        }

        // Ejecutar la consulta
        if (!$stmt->execute()) {
            throw new Exception("Error al ejecutar la actualización: " . $stmt->error);
        }

        // Confirmar transacción
        $conn->commit();

        // Actualizar datos de sesión
        $_SESSION['nombre_completo'] = $nombre_completo;
        $_SESSION['email'] = $email;
        $_SESSION['genero'] = $genero;
        $_SESSION['fecha_nacimiento'] = $fecha_nacimiento;

        echo json_encode(['success' => true, 'message' => 'Perfil actualizado con éxito']);

    } catch (Exception $e) {
        // Revertir transacción en caso de error
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => 'Error al actualizar el perfil: ' . $e->getMessage()]);
    }

    // Cerrar declaración
    if (isset($stmt)) {
        $stmt->close();
    }
}

// Cerrar conexión
$conn->close();
?>
