<?php
// Conexion a la base de datos
session_start();
include '../conexion.php';

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["success" => false, "error" => "Usuario no autenticado"]);
    exit;
}
$id_instructor = $_SESSION['id_usuario']; // ID del instructor logueado

try {
    // Consulta SQL con un parámetro
    $query = "
        SELECT DISTINCT u.ID_Usuario, u.Nombre_Completo, u.Avatar, c.ID_Curso, c.Titulo AS Curso
        FROM Usuarios u
        INNER JOIN Kardex k ON u.ID_Usuario = k.ID_Estudiante
        INNER JOIN Cursos c ON k.ID_Curso = c.ID_Curso
        WHERE c.ID_Instructor = :id_instructor
          AND u.ID_Usuario != :id_instructor
          AND c.Estado = 'Activo';
    ";

    // Preparar y ejecutar la consulta
    $stmt = $pdo->prepare($query);

    // Pasar el parámetro a la consulta
    $stmt->bindParam(':id_instructor', $id_instructor, PDO::PARAM_INT);

    // Ejecutar la consulta
    $stmt->execute();

    // Obtener los resultados
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Enviar los datos como JSON para tu front-end
    echo json_encode($result);
} catch (PDOException $e) {
    // Manejo de errores
    echo json_encode(['error' => $e->getMessage()]);
}
?>
