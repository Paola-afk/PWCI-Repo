<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'conexion.php';

header('Content-Type: application/json');

if (isset($_GET['report_type'])) {
    $report_type = $_GET['report_type'];

    if ($report_type == 'instructores') {
        $sql = "SELECT Usuario, Nombre_Completo, Fecha_Ingreso, Cantidad_Cursos_Ofrecidos, Total_Ganancias FROM Instructores";
    } elseif ($report_type == 'estudiantes') {
        $sql = "SELECT Usuario, Nombre_Completo, Fecha_Ingreso, Cantidad_Cursos_Inscritos, Porcentaje_Cursos_Terminados FROM Estudiantes";
    } else {
        echo json_encode([]);
        exit;
    }

    $result = $conn->query($sql);
    $reportes = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $reportes[] = $row;
        }
    }

    echo json_encode($reportes);
} else {
    echo json_encode(['error' => 'No report_type specified']);
}

$conn->close();
?>
