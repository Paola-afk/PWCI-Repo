<?php
function verificarCompra($conn, $usuarioID, $cursoID) {
    $query = "
        SELECT COUNT(*) AS total
        FROM Ventas
        WHERE ID_Estudiante = ? AND ID_Curso = ?
    ";

    $stmt = $conn->prepare($query);
    if (!$stmt) {
        echo json_encode(["error" => "Error en la preparación de la consulta: " . $conn->error]);
        exit();
    }

    $stmt->bind_param("ii", $usuarioID, $cursoID);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_assoc();

    if ($data['total'] == 0) {
        echo json_encode(["error" => "Solo los usuarios que han comprado este curso pueden realizar esta acción."]);
        exit();
    }

    $stmt->close();
}
