<?php
// Conexión a la base de datos
include 'conexion.php'; // Archivo que contiene la conexión a la base de datos

header('Content-Type: application/json');

// Verificar conexión
if (!$conn) {
    echo json_encode(["error" => "Error al conectar con la base de datos"]);
    exit();
}

// Obtener el ID del curso desde los parámetros GET
$id_curso = isset($_GET['id_curso']) ? intval($_GET['id_curso']) : 0;

if ($id_curso <= 0) {
    echo json_encode(["error" => "ID del curso inválido"]);
    exit();
}

// Consulta para obtener los comentarios
$sql = "SELECT comentarios.Comentario, comentarios.Calificacion, comentarios.Fecha_comentario, 
               usuarios.Nombre_Completo AS Usuario 
        FROM comentarios 
        INNER JOIN usuarios ON comentarios.ID_Usuario = usuarios.ID_Usuario 
        WHERE comentarios.ID_Curso = ? 
        ORDER BY comentarios.Fecha_comentario DESC";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["error" => "Error al preparar la consulta"]);
    exit();
}

$stmt->bind_param("i", $id_curso);
$stmt->execute();
$result = $stmt->get_result();

// Crear un array para almacenar los comentarios
$comentarios = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $comentarios[] = $row;
    }
} else {
    // Si no hay comentarios
    $comentarios = ["message" => "No hay comentarios para este curso"];
}

$stmt->close();
$conn->close();

// Devolver los comentarios como JSON
echo json_encode($comentarios);
?>
