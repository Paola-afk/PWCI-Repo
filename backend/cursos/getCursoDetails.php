<?php
// Incluye el archivo de conexión a la base de datos
require_once '../conexion.php'; // Asegúrate de que la ruta es correcta

// Asegúrate de que la cabecera de respuesta sea de tipo JSON
header('Content-Type: application/json');

// Asegúrate de que el parámetro 'id' esté presente en la URL
if (!isset($_GET['id'])) {
    echo json_encode(['error' => 'ID del curso no proporcionado']);
    exit;
}

// Conectar a la base de datos (esto debería estar en conexion.php)
$cursoID = $_GET['id'];

// Verificar que el ID sea un número válido (opcional)
if (!is_numeric($cursoID)) {
    echo json_encode(['error' => 'ID del curso no válido']);
    exit;
}

// Realizar la consulta
$query = "SELECT * FROM Cursos WHERE ID_Curso = ?";
$stmt = $pdo->prepare($query);
$stmt->execute([$cursoID]);

// Obtener los resultados
$curso = $stmt->fetch(PDO::FETCH_ASSOC);

// Si no se encontró el curso, devolver un error
if (!$curso) {
    echo json_encode(['error' => 'Curso no encontrado']);
    exit;
}

// Devolver los detalles del curso en formato JSON
echo json_encode($curso);
?>
