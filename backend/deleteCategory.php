<?php
include 'conexion.php'; // Incluir archivo de conexión

// Verificar que se reciba el ID de la categoría
if (isset($_POST['id_categoria'])) {
    $id_categoria = $_POST['id_categoria'];

    // Preparar y ejecutar el procedimiento almacenado
    $query = "CALL BajaLogicaCategoria(?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id_categoria); // 'i' para INT

    // Ejecutar la consulta y verificar
    if ($stmt->execute()) {
        echo 'Categoría desactivada correctamente';
    } else {
        echo 'Error al desactivar la categoría: ' . $stmt->error;
    }

    // Cerrar la conexión y la declaración
    $stmt->close();
    $conn->close();
} else {
    echo 'Error: No se ha proporcionado el ID de la categoría.';
}
?>
