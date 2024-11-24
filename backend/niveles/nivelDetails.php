<?php
include '../conexion.php';
header('Content-Type: application/json');

if (isset($_GET['nivel_id'])) {
    $nivel_id = $_GET['nivel_id'];
    $sql = "SELECT * FROM niveles WHERE ID_Nivel = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $nivel_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $nivel = $result->fetch_assoc();

    echo json_encode(['nivel' => $nivel]);
} else {
    echo json_encode(['error' => 'No se proporcionó el ID del nivel']);
}
$conn->close();
