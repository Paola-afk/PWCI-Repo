<?php

include '../conexion.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['id'], $data['titulo'], $data['contenido'], $data['video'], $data['documento'], $data['estado'])) {
    $id = $data['id'];
    $titulo = $data['titulo'];
    $contenido = $data['contenido'];
    $video = $data['video'];
    $documento = $data['documento'];
    $estado = $data['estado'];

    $sql = "UPDATE niveles 
            SET Titulo = ?, Contenido = ?, Video = ?, Documento = ?, Estado = ? 
            WHERE ID_Nivel = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssi", $titulo, $contenido, $video, $documento, $estado, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
}
$conn->close();

?>