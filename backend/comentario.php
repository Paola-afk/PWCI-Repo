<?php
session_start();
include 'conexion.php';
include 'middlewareComentarios.php';

header('Content-Type: application/json');

// Verificar si el usuario está logueado
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["error" => "Usuario no logueado"]);
    exit();
}

// Obtener datos del cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

// Registro de datos para depuración
error_log("Datos recibidos en comentario.php: " . json_encode($data));

// Validar que se enviaron los parámetros necesarios
if (!isset($data['cursoID']) || !isset($data['comentario']) || !isset($data['calificacion'])) {
    echo json_encode(["error" => "Faltan parámetros necesarios."]);
    exit();
}

// Asignar valores de la solicitud
$usuarioID = $_SESSION['id_usuario'];
$cursoID = $data['cursoID'];
$comentario = $data['comentario'];
$calificacion = $data['calificacion'];

// Validar si el usuario compró el curso
verificarCompra($conn, $usuarioID, $cursoID);

// Función para limpiar comentarios
function limpiarComentario($comentario) {
    $palabrasProhibidas = ['Idiota', 'Pendejo', 'Pendeja', 'Mierda', 'Imbécil'];
    foreach ($palabrasProhibidas as $prohibida) {
        $comentario = str_ireplace($prohibida, '****', $comentario);
    }
    return $comentario;
}

// Limpiar el comentario
$comentario = limpiarComentario($comentario);

// Validar que la calificación esté en el rango correcto
if ($calificacion < 1 || $calificacion > 5) {
    echo json_encode(["error" => "La calificación debe estar entre 1 y 5."]);
    exit();
}

// Preparar la consulta para insertar el comentario
$query = "INSERT INTO comentarios (ID_Curso, ID_Usuario, Comentario, Calificacion) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode(["error" => "Error en la preparación de la consulta: " . $conn->error]);
    exit();
}

$stmt->bind_param("iisi", $cursoID, $usuarioID, $comentario, $calificacion);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Comentario guardado con éxito."]);
} else {
    echo json_encode(["error" => "Error al guardar el comentario: " . $stmt->error]);
}

// Cerrar conexión
$stmt->close();
$conn->close();

?>
