<?php
require_once 'conexion.php'; // Incluye la conexión a la base de datos
global $pdo;
// Verificar si $pdo está definido
if (isset($pdo)) {
    echo "Conexión establecida.";
} else {
    die("Error: \$pdo no está definido.");
}

try {
    // Preparar y ejecutar la llamada al procedimiento almacenado
    $stmt = $pdo->prepare("CALL GetCategorias()");
    $stmt->execute();

    // Procesar los resultados
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "<tr>";
        echo "<td>" . htmlspecialchars($row['Nombre_Categoria']) . "</td>";
        echo "<td>" . htmlspecialchars($row['Descripcion']) . "</td>";
        echo "<td>
                <button class='btn btn-secondary btn-sm'>Editar</button>
                <button class='btn btn-danger btn-sm'>Eliminar</button>
                </td>";
        echo "</tr>";
    }

    $stmt->closeCursor(); // Limpia la conexión para nuevas consultas
} catch (PDOException $e) {
    echo "<tr><td colspan='4' style='color: red;'>Error al cargar categorías: " . htmlspecialchars($e->getMessage()) . "</td></tr>";
}
?>
