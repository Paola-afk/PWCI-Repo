<?php
// Asumiendo que ya has iniciado sesión y que tienes la conexión a la base de datos
session_start();
include('../conexion.php'); // Incluye tu archivo de conexión a la base de datos

if (isset($_GET['curso_id'])) {
    $cursoId = $_GET['curso_id'];
    $userId = $_SESSION['id_usuario']; // Obtén el ID del usuario actual desde la sesión

    // Verifica si el curso existe y si el usuario está inscrito en el curso
    $query = "SELECT * FROM Kardex WHERE ID_Curso = ? AND ID_Estudiante = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $cursoId, $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Actualiza el progreso y el estado del curso
        $updateQuery = "UPDATE Kardex SET Progreso = 100, Estado = 'Completado' WHERE ID_Curso = ? AND ID_Estudiante = ?";
        $updateStmt = $conn->prepare($updateQuery);
        $updateStmt->bind_param("ii", $cursoId, $userId);
        if ($updateStmt->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No se pudo actualizar el curso.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'El usuario no está inscrito en este curso.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'ID del curso no proporcionado.']);
}
?>
