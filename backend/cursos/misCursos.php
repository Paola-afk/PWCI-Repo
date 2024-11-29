<?php
header('Content-Type: application/json');
session_start();

include_once "../conexion.php";

// Validar sesión del usuario
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(['error' => 'Usuario no autenticado']);
    exit;
}

$id_estudiante = $_SESSION['id_usuario'];

// Consulta para obtener los cursos comprados
$query = "SELECT c.ID_Curso, c.Titulo, c.Imagen, k.Progreso, k.Estado 
            FROM Kardex k 
            JOIN Cursos c ON k.ID_Curso = c.ID_Curso 
            WHERE k.ID_Estudiante = ? AND k.Estado IN ('Activo', 'Completado')";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $id_estudiante);
$stmt->execute();
$result = $stmt->get_result();

$cursos = [];
while ($row = $result->fetch_assoc()) {
    $cursos[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode($cursos);
