<?php
header('Content-Type: application/json');
include '../conexion.php';
include('../get_session.php');

// Verificar si la sesión está iniciada
if (!isset($_SESSION)) {
    echo json_encode(["error" => "No se pudo iniciar la sesión correctamente."]);
    exit;
}

$idInstructor = $_SESSION['id_usuario'] ?? null;
$data = json_decode(file_get_contents("php://input"), true);
$idCurso = $data['idCurso'] ?? null;

if (!$idCurso) {
    echo json_encode(["error" => "No se recibió el ID del curso."]);
    exit;
}

// Verificar si el ID del curso es válido
if (!is_numeric($idCurso)) {
    echo json_encode(["error" => "El ID del curso no es válido."]);
    exit;
}

// Ejecutar procedimiento almacenado para obtener el detalle
$stmt = $conn->prepare("CALL GetDetalleCursoInstructor(?, ?)");
$stmt->bind_param("ii", $idInstructor, $idCurso);
$stmt->execute();
$result = $stmt->get_result();

$detalle = [];
while ($row = $result->fetch_assoc()) {
    $detalle[] = $row;
}

$stmt->close();

// Si no se encontró ningún detalle, devolver un mensaje de error
if (empty($detalle)) {
    echo json_encode(["error" => "No se encontraron detalles para este curso."]);
} else {
    echo json_encode(["detalles" => $detalle]);
}
?>
