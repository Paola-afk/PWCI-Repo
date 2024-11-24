<?php
include 'conexion.php'; // Archivo que contiene la conexión a la base de datos

// Establecer el tipo de contenido para la respuesta JSON
header('Content-Type: application/json');
session_start();

// Verificar la conexión
if (!$conn) {
    echo json_encode(["error" => "Error al conectar con la base de datos"]);
    exit();
}

// Verificar si el usuario está logueado
if (!isset($_SESSION['usuarioID'])) {
    echo json_encode(["error" => "Usuario no logueado"]);
    exit();
}

// Obtener el ID del usuario desde la sesión
$usuarioID = $_SESSION['usuarioID'];  // Obtener el ID del usuario desde la sesión

// Verificar si se ha recibido el cursoID en la URL
if (!isset($_GET['cursoID'])) {
    echo json_encode(["error" => "Faltan parámetros necesarios."]);
    exit();
}

$cursoID = $_GET['cursoID'];  // Obtener el ID del curso desde la URL

// Verificar si el usuario puede comentar
function puedeComentar($usuarioID, $cursoID) {
    global $conn;  // Asegúrate de que la variable de conexión está disponible

    // Preparar la consulta SQL
    $query = "SELECT k.ID_Estudiante, k.ID_Curso, k.Estado AS Kardex_Estado
              FROM Kardex k
              JOIN Ventas v ON v.ID_Curso = k.ID_Curso AND v.ID_Estudiante = k.ID_Estudiante
              WHERE k.ID_Estudiante = ? AND k.ID_Curso = ? AND k.Estado = 'Completado'";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $usuarioID, $cursoID);
    $stmt->execute();
    $result = $stmt->get_result();

    // Verificar si existe el registro
    if ($result->num_rows > 0) {
        return true; // El usuario ha completado el curso
    } else {
        return false; // El usuario no ha completado el curso
    }
}

// Llamada para verificar si el usuario puede comentar
if (puedeComentar($usuarioID, $cursoID)) {
    // El usuario puede comentar, devolver respuesta adecuada
    echo json_encode(['canComment' => true]);
} else {
    // El usuario no puede comentar
    echo json_encode(['canComment' => false, 'message' => 'Debes completar el curso antes de comentar.']);
}

?>
