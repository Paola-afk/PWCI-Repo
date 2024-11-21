<?php
require_once 'conexion.php'; // Incluir la conexión a la base de datos

try {
    // Ejecutar la consulta para obtener las categorías
    $stmt = $pdo->query("SELECT * FROM Categorias");

    // Comprobar si la consulta se ejecutó correctamente
    if ($stmt === false) {
        throw new Exception('Error al ejecutar la consulta.');
    }

    // Mostrar los datos de las categorías
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "<tr>";
        echo "<td>" . htmlspecialchars($row['id_categoria']) . "</td>";
        echo "<td>" . htmlspecialchars($row['nombre_categoria']) . "</td>";
        echo "<td>
                <button class='btn btn-secondary btn-sm'>Editar</button>
                <button class='btn btn-danger btn-sm'>Eliminar</button>
              </td>";
        echo "</tr>";
    }
} catch (PDOException $e) {
    echo "<tr><td colspan='3' style='color: red;'>Error al cargar categorías: " . htmlspecialchars($e->getMessage()) . "</td></tr>";
} catch (Exception $e) {
    echo "<tr><td colspan='3' style='color: red;'>Error: " . htmlspecialchars($e->getMessage()) . "</td></tr>";
}
?>
