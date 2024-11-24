<?php
session_start();
include 'conexion.php';

header('Content-Type: application/json');

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["error" => "Usuario no logueado"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['cursoID']) || !isset($data['comentario']) || !isset($data['calificacion'])) {
    echo json_encode(["error" => "Faltan parámetros necesarios."]);
    exit();
}

$usuarioID = $_SESSION['id_usuario'];
$cursoID = $data['cursoID'];
$comentario = $data['comentario'];
$calificacion = $data['calificacion'];

$query = "INSERT INTO comentarios (ID_Curso, ID_Usuario, Comentario, Calificacion) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("iisi", $cursoID, $usuarioID, $comentario, $calificacion);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Comentario guardado con éxito."]);
} else {
    echo json_encode(["error" => "Error al guardar el comentario."]);
}

$stmt->close();
$conn->close();
?>
