<?php
session_start();
require 'conexion.php';
header('Content-Type: application/json');

// Verificar si el usuario está logueado
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit();
}

// Obtener los datos del cuerpo de la solicitud
$input = json_decode(file_get_contents('php://input'), true);
$id_usuario = $_SESSION['id_usuario'];
$nombre_completo = $input['nombreCompleto'];
$email = $input['email'];
$genero = $input['genero'];
$fecha_nacimiento = $input['fechaNacimiento'];
$contrasena = $input['contrasena'];

// Validar datos
if (empty($nombre_completo) || empty($email) || empty($genero) || empty($fecha_nacimiento)) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios']);
    exit();
}

// Si la contraseña es nula, no actualizar la contraseña
$contrasena_encriptada = null;
if ($contrasena !== null) {
    $contrasena_encriptada = password_hash($contrasena, PASSWORD_BCRYPT);
}

// Preparar el procedimiento almacenado
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']);
    exit();
}

if ($contrasena_encriptada) {
    $sql = "CALL UpdateUsuario(?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isssss", $id_usuario, $nombre_completo, $email, $genero, $fecha_nacimiento, $contrasena_encriptada);
} else {
    $sql = "CALL UpdateUsuarioSinPassword(?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("issss", $id_usuario, $nombre_completo, $email, $genero, $fecha_nacimiento);
}

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Perfil actualizado correctamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar el perfil: ' . $stmt->error]);
}

// Cerrar conexiones
$stmt->close();
$conn->close();
?>
