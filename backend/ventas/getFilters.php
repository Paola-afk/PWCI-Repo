<?php
// Verificar el contenido de la sesión
//session_start();
header('Content-Type: application/json');
include '../conexion.php';
include('../get_session.php'); 

if (!isset($_SESSION)) {
    echo json_encode(["error" => "No se pudo iniciar la sesión correctamente."]);
    exit;
}

$idInstructor = $_SESSION['id_usuario'] ?? null;
// Obtener los datos enviados en el cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

// Validar y sanitizar los datos de entrada
$fechaInicio = $data["fechaInicio"] ?? null;
$fechaFin = $data["fechaFin"] ?? null;
$categoria = $data["categoria"] ?? "todas";
$soloActivos = isset($data["soloActivos"]) ? (int)$data["soloActivos"] : 0;

// Validar formato de fechas (si están definidas)
if ($fechaInicio && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fechaInicio)) {
    echo json_encode(["error" => "El formato de fecha de inicio no es válido."]);
    exit;
}
if ($fechaFin && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fechaFin)) {
    echo json_encode(["error" => "El formato de fecha de fin no es válido."]);
    exit;
}

try {
    // Preparar y ejecutar el procedimiento almacenado
    $stmt = $conn->prepare("CALL GetReporteVentasInstructor(?, ?, ?, ?, ?)");
    $stmt->bind_param("isssi", $idInstructor, $fechaInicio, $fechaFin, $categoria, $soloActivos);
    $stmt->execute();
    $result = $stmt->get_result();

    // Procesar los resultados
    $resumen = [];
    while ($row = $result->fetch_assoc()) {
        $resumen[] = $row;
    }

    $stmt->close();

    // Devolver los datos en formato JSON
    echo json_encode(["resumen" => $resumen, "detalle" => []]);

} catch (Exception $e) {
    // Manejo de errores
    http_response_code(500); // Error interno del servidor
    echo json_encode(["error" => "Error al procesar la solicitud: " . $e->getMessage()]);
    exit;
}
?>
