<?php
require_once 'conexion.php'; // Incluye la conexión a la base de datos

// Parámetro recibido de la solicitud (GET o POST)
$tipo = isset($_GET['tipo']) ? $_GET['tipo'] : '';

// Validar que el parámetro es válido
if (!in_array($tipo, ['topRated', 'mostSold', 'mostRecent'])) {
    echo json_encode(["error" => "Tipo de curso no válido"]);
    exit;
}

try {
    // Preparar la llamada al Stored Procedure
    $stmt = $pdo->prepare("CALL GetCursosPorTipo(?)");

    // Ejecutar el procedimiento almacenado pasando el parámetro
    $stmt->execute([$tipo]);

    // Obtener los resultados
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devolver los resultados como JSON
    echo json_encode($courses);

} catch (PDOException $e) {
    echo json_encode(["error" => "Error al ejecutar el procedimiento almacenado: " . htmlspecialchars($e->getMessage())]);
}
?>
