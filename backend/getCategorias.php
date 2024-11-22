<?php
require_once 'conexion.php'; // Incluye la conexión a la base de datos
global $pdo;

// Verificar si $pdo está definido
if (isset($pdo)) {
    // echo "Conexión establecida.";  // Puedes quitar esto en producción
} else {
    die("Error: \$pdo no está definido.");
}

try {
    // Preparar y ejecutar la consulta para obtener las categorías
    $stmt = $pdo->prepare("SELECT ID_Categoria, Nombre_Categoria, Descripcion FROM Categorias");
    $stmt->execute();

    // Crear un array para almacenar las categorías
    $categorias = [];

    // Procesar los resultados y almacenarlos en el array
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $categorias[] = [
            'ID_Categoria' => $row['ID_Categoria'],
            'Nombre_Categoria' => $row['Nombre_Categoria'],
            'Descripcion' => $row['Descripcion']
        ];
    }

    // Devolver los datos como JSON
    echo json_encode($categorias);

    $stmt->closeCursor(); // Limpia la conexión para nuevas consultas
} catch (PDOException $e) {
    // Devolver un mensaje de error en JSON
    echo json_encode(["error" => "Error al cargar categorías: " . htmlspecialchars($e->getMessage())]);
}
?>
