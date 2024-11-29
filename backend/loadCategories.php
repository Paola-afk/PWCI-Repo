<?php
require_once 'conexion.php'; // Incluye la conexión a la base de datos
global $pdo;

try {
    // Preparar y ejecutar la llamada al procedimiento almacenado
    $stmt = $pdo->prepare("CALL GetCategorias()");
    $stmt->execute();

    // Crear un array para almacenar las categorías
    $categorias = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $categorias[] = $row;
    }

    // Devolver el array en formato JSON
    echo json_encode($categorias);

    $stmt->closeCursor(); // Limpia la conexión para nuevas consultas
} catch (PDOException $e) {
    echo json_encode(['error' => 'Error al cargar categorías: ' . $e->getMessage()]);
}
?>
