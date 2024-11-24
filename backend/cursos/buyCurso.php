<?php
session_start();
require_once '../conexion.php'; // Conexión a la base de datos

header('Content-Type: application/json');

// Verificar si el usuario está autenticado
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(['error' => 'Usuario no autenticado']);
    exit;
}

$idEstudiante = $_SESSION['id_usuario'];

// Leer y decodificar los datos enviados desde el frontend
$inputData = json_decode(file_get_contents('php://input'), true);

// Validar que los datos contengan cursos y el total pagado
if (!$inputData || empty($inputData['cursos']) || !isset($inputData['totalPagado']) || !isset($inputData['formaPago'])) {
    echo json_encode(['error' => 'Datos inválidos o incompletos']);
    exit;
}

$cursos = $inputData['cursos'];
$totalPagado = $inputData['totalPagado'];
$formaPago = $inputData['formaPago'];

try {
    // Iniciar una transacción
    $pdo->beginTransaction();

    $precioPorCurso = $totalPagado / count($cursos); // Dividir el total entre la cantidad de cursos

    foreach ($cursos as $idCurso) {
        // Verificar si el curso ya está en el Kardex del estudiante
        $checkQuery = "SELECT * FROM Kardex WHERE ID_Estudiante = :idEstudiante AND ID_Curso = :idCurso";
        $checkStmt = $pdo->prepare($checkQuery);
        $checkStmt->bindParam(':idEstudiante', $idEstudiante, PDO::PARAM_INT);
        $checkStmt->bindParam(':idCurso', $idCurso, PDO::PARAM_INT);
        $checkStmt->execute();

        if ($checkStmt->rowCount() == 0) {
            // Insertar el curso en el Kardex
            $insertKardexQuery = "
                INSERT INTO Kardex (ID_Estudiante, ID_Curso, Progreso, Forma_Pago, Precio_Pagado, Estado) 
                VALUES (:idEstudiante, :idCurso, 0, :formaPago, :precioPagado, 'Activo')
            ";
            $insertKardexStmt = $pdo->prepare($insertKardexQuery);
            $insertKardexStmt->bindParam(':idEstudiante', $idEstudiante, PDO::PARAM_INT);
            $insertKardexStmt->bindParam(':idCurso', $idCurso, PDO::PARAM_INT);
            $insertKardexStmt->bindParam(':formaPago', $formaPago, PDO::PARAM_STR);
            $insertKardexStmt->bindParam(':precioPagado', $precioPorCurso, PDO::PARAM_STR);
            $insertKardexStmt->execute();

            // Insertar la venta en la tabla Ventas
            $insertVentaQuery = "
                INSERT INTO Ventas (ID_Estudiante, ID_Curso, Monto_pagado, forma_pago) 
                VALUES (:idEstudiante, :idCurso, :montoPagado, :formaPago)
            ";
            $insertVentaStmt = $pdo->prepare($insertVentaQuery);
            $insertVentaStmt->bindParam(':idEstudiante', $idEstudiante, PDO::PARAM_INT);
            $insertVentaStmt->bindParam(':idCurso', $idCurso, PDO::PARAM_INT);
            $insertVentaStmt->bindParam(':montoPagado', $precioPorCurso, PDO::PARAM_STR);
            $insertVentaStmt->bindParam(':formaPago', $formaPago, PDO::PARAM_STR);
            $insertVentaStmt->execute();
        }
    }

    // Confirmar la transacción
    $pdo->commit();

    echo json_encode(['success' => 'Cursos adquiridos exitosamente.']);
} catch (PDOException $e) {
    // Revertir la transacción en caso de error
    $pdo->rollBack();
    echo json_encode(['error' => $e->getMessage()]);
}
