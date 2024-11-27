<?php
session_start(); // Asegúrate de que la sesión esté iniciada
header('Content-Type: application/json'); 
require_once '../conexion.php';

// Verificar si el usuario está autenticado
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["error" => "Usuario no autenticado.", "session" => $_SESSION]);
    exit;
}

// Verificar si se proporcionó el ID del curso
if (!isset($_GET['curso_id'])) {
    echo json_encode(["error" => "No se proporcionó un ID de curso."]);
    exit;
}

$studentId = $_SESSION['id_usuario']; // ID del estudiante desde la sesión
$courseId = intval($_GET['curso_id']);  // ID del curso desde la URL

// Consulta para verificar el progreso del curso
$query = "
    SELECT Progreso, Estado 
    FROM Kardex 
    WHERE ID_Estudiante = ? AND ID_Curso = ?
";
$stmt = $pdo->prepare($query);
$stmt->execute([$studentId, $courseId]);
$kardex = $stmt->fetch(PDO::FETCH_ASSOC);

$response = [
    "success" => true,
    "session" => [
        "email" => $_SESSION['email'],
        "id_usuario" => $_SESSION['id_usuario'],
        "rol" => $_SESSION['rol'],
        "avatar" => $_SESSION['avatar'],
        "nombre_completo" => $_SESSION['nombre_completo'],
        "genero" => $_SESSION['genero'],
        "fecha_nacimiento" => $_SESSION['fecha_nacimiento']
    ]
];

if ($kardex) {
    if ($kardex['Progreso'] == 100.00 && $kardex['Estado'] === 'Completado') {
        $response["status"] = "Completado";
    } else {
        $response["status"] = "en_progreso";
        $response["progreso"] = $kardex['Progreso'];
    }
} else {
    $response["error"] = "No se encontró progreso para este curso.";
}

echo json_encode($response);
?>
