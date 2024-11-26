<?php
// Conexion a la base de datos
session_start();
include '../conexion.php';

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["success" => false, "error" => "Usuario no autenticado"]);
    exit;
}

$id_instructor = $_SESSION['id_usuario']; // ID del instructor logueado
$destinatario_id = $_GET['destinatario_id'] ?? null; // ID del estudiante con quien se está chateando
$id_curso = $_GET['id_curso'] ?? null; // ID del curso asociado al chat

if (!$destinatario_id || !$id_curso) {
    echo json_encode(["success" => false, "error" => "Faltan parámetros obligatorios"]);
    exit;
}

try {
    // Consulta para obtener mensajes
    $query = "
        SELECT m.Mensaje, m.Archivo, m.Fecha_envio, 
               CASE 
                   WHEN m.ID_Remitente = :id_instructor THEN 'Instructor' 
                   ELSE 'Estudiante' 
               END AS Tipo,
               u.Avatar
        FROM Mensajes m
        INNER JOIN Usuarios u ON m.ID_Remitente = u.ID_Usuario
        WHERE m.ID_Curso = :id_curso
          AND ((m.ID_Remitente = :id_instructor AND m.ID_Destinatario = :destinatario_id)
            OR (m.ID_Remitente = :destinatario_id AND m.ID_Destinatario = :id_instructor))
        ORDER BY m.Fecha_envio ASC;
    ";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':id_instructor', $id_instructor, PDO::PARAM_INT);
    $stmt->bindParam(':destinatario_id', $destinatario_id, PDO::PARAM_INT);
    $stmt->bindParam(':id_curso', $id_curso, PDO::PARAM_INT);
    $stmt->execute();

    $mensajes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($mensajes);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
