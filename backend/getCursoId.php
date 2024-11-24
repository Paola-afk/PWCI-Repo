<?php
include 'conexion.php';

header('Content-Type: application/json');

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    $sql = "SELECT * FROM Cursos WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $curso = $result->fetch_assoc();

    echo json_encode($curso);
} else {
    echo json_encode(['error' => 'No se proporcionó un ID de curso']);
}

$conn->close();
?>
