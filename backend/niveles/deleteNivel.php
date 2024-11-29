<?php
include 'conexion.php'; // Incluye la conexión a la base de datos

// Configurar encabezado de respuesta
header('Content-Type: application/json');

// Verificar que el ID del nivel fue proporcionado
if (isset($_GET['nivel_id'])) {
    $nivelId = (int) $_GET['nivel_id'];

    // Consulta para la eliminación lógica del nivel
    $query = "UPDATE Niveles SET Estado = 'Inactivo' WHERE ID_Nivel = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $nivelId);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Nivel eliminado exitosamente.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al eliminar el nivel.']);
    }

    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No se proporcionó el ID del nivel.']);
}

$conn->close();
?>
