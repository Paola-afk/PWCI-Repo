<?php 
session_start();
include 'conexion.php'; // Conexión a la base de datos
include 'get_session.php';
include 'gravatar.php'; // Este archivo debe contener la función get_gravatar

// Habilitar errores para depuración (solo en desarrollo)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Verifica si el ID de usuario está disponible en la sesión
$id_usuario = isset($_SESSION['id_usuario']) ? $_SESSION['id_usuario'] : '';
if (empty($id_usuario)) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'ID de usuario no encontrado en la sesión.']);
    exit();
}

// Verifica si se seleccionó usar Gravatar
$use_gravatar = isset($_POST['use_gravatar']) ? true : false;

// Verifica si se recibió un archivo
if (isset($_FILES['avatar']) && !$use_gravatar) {
    $avatar_destino = '';
    // Verificación de la subida correcta del archivo
    if ($_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
        $avatar = $_FILES['avatar']['name'];
        $avatar_tmp = $_FILES['avatar']['tmp_name'];
        $avatar_destino = 'uploads/' . uniqid() . '-' . basename($avatar); // Añadir nombre único al archivo
        // Intentar mover el archivo al directorio de destino
        if (!move_uploaded_file($avatar_tmp, $avatar_destino)) {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => 'Error al mover el archivo de avatar.']);
            exit();
        }
    } else {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Error en la subida del archivo: ' . $_FILES['avatar']['error']]);
        exit();
    }

    // Actualizar avatar en la base de datos
    $stmt = $conn->prepare("CALL UpdateAvatar(?, ?)");
    if (!$stmt) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Error en la preparación de la consulta: ' . $conn->error]);
        exit();
    }
    $stmt->bind_param("is", $id_usuario, $avatar_destino);
    if ($stmt->execute()) {
        // Enviar una respuesta de éxito
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'new_avatar_url' => $avatar_destino]);
    } else {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Error al actualizar el avatar: ' . $stmt->error]);
    }
    $stmt->close();
} elseif ($use_gravatar) {
    // Obtener correo electrónico del usuario
    $sql = "SELECT Email FROM Usuarios WHERE ID_Usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $stmt->bind_result($email_usuario);
    $stmt->fetch();
    $stmt->close();

    // Obtener la URL del Gravatar
    $gravatar_url = get_gravatar($email_usuario);

    // Actualizar avatar en la base de datos
    $stmt = $conn->prepare("CALL UpdateAvatar(?, ?)");
    if (!$stmt) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Error en la preparación de la consulta: ' . $conn->error]);
        exit();
    }
    $stmt->bind_param("is", $id_usuario, $gravatar_url);
    if ($stmt->execute()) {
        // Enviar una respuesta de éxito
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'new_avatar_url' => $gravatar_url]);
    } else {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Error al actualizar el avatar: ' . $stmt->error]);
    }
    $stmt->close();
} else {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'No se recibió un archivo ni se seleccionó usar Gravatar.']);
}
$conn->close();
?>
