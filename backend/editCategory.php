<?php
include 'conexion.php'; // Incluir archivo de conexión

// Verificar que se reciban los datos correctos
if (isset($_POST['id_categoria'], $_POST['nombre_categoria'], $_POST['descripcion'])) {
    $id_categoria = $_POST['id_categoria'];
    $nombre_categoria = $_POST['nombre_categoria'];
    $descripcion = $_POST['descripcion'];

    // Preparar y ejecutar el procedimiento almacenado
    $query = "CALL EditarCategoria(?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("iss", $id_categoria, $nombre_categoria, $descripcion); // 'i' para INT, 's' para VARCHAR

    // Ejecutar la consulta y verificar
    if ($stmt->execute()) {
        echo 'Categoría actualizada correctamente';
    } else {
        echo 'Error al actualizar la categoría: ' . $stmt->error;
    }

    // Cerrar la conexión y la declaración
    $stmt->close();
    $conn->close();
} else {
    echo 'Error: Datos incompletos.';
}
?>