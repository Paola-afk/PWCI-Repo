<?php
include '../conexion.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $tipo = $_GET['tipo'] ?? null; // Tipo de reporte: 'instructores' o 'estudiantes'

    try {
        $pdo = getPDO();

        if ($tipo === 'instructores') {
            $stmt = $pdo->query("CALL ReporteInstructores()");
            $reporte = $stmt->fetchAll();
        } elseif ($tipo === 'estudiantes') {
            $stmt = $pdo->query("CALL ReporteEstudiantes()");
            $reporte = $stmt->fetchAll();
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Tipo de reporte inválido.']);
            exit;
        }

        echo json_encode($reporte);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido.']);
}
