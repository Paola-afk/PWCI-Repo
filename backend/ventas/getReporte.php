<?php
header('Content-Type: application/json');
include '../conexion.php';
include('../get_session.php');

// Verificar si el usuario está autenticado
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["error" => "No se pudo obtener la sesión."]);
    exit;
}

$idInstructor = $_SESSION['id_usuario'] ?? null;

// Recibir los datos enviados desde el cliente
$data = json_decode(file_get_contents("php://input"), true);
$fechaInicio = $data['fechaInicio'] ?? null;
$fechaFin = $data['fechaFin'] ?? null;
$categoria = $data['categoria'] ?? 'todas';
$soloActivos = $data['soloActivos'] ?? false;

$stmt = $conn->prepare("CALL GetReporteVentasInstructor(?, ?, ?, ?, ?)");
$stmt->bind_param("isssi", $idInstructor, $fechaInicio, $fechaFin, $categoria, $soloActivos);
$stmt->execute();

$result = $stmt->get_result();
$response = [];

while ($row = $result->fetch_assoc()) {
    $response[] = [
        "Curso" => $row["Curso"],
        "Alumnos_Inscritos" => $row["Alumnos_Inscritos"],
        "Nivel_Promedio" => $row["Nivel_Promedio"],
        "Alumnos_Egresados" => $row["Alumnos_Egresados"],
        "Total_Ingresos" => $row["Total_Ingresos"],
        "Formas_Pago" => $row["Formas_Pago"]
    ];
}

$stmt->close();
$conn->close();

echo json_encode($response);
