<?php
require_once 'conexion.php'; // Incluye la conexión a la base de datos

// Recibe la acción que determina qué tipo de cursos se deben obtener
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Verifica la acción y ejecuta el procedimiento almacenado adecuado
switch ($action) {
    case 'getTopRated': 
        $tipo = 'topRated';
        break;
    case 'getMostSold': 
        $tipo = 'mostSold';
        break;
    case 'getMostRecent': 
        $tipo = 'mostRecent';
        break;
    default:
        die("Acción no válida.");
}

// Llamar al procedimiento almacenado que obtiene los cursos por tipo
try {
    $stmt = $pdo->prepare("CALL GetCursosPorTipo(?)");
    $stmt->execute([$tipo]);
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($courses); // Devolver los cursos como JSON
} catch (PDOException $e) {
    echo json_encode(["error" => "Error al cargar los cursos: " . htmlspecialchars($e->getMessage())]);
}
?>
