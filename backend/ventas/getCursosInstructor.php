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


// Depuración
if (!$idInstructor) {
    echo json_encode(["error" => "La sesión no contiene un ID de usuario válido.", "session" => $_SESSION]);
    exit;
}


$stmt = $conn->prepare("SELECT ID_Curso, Titulo FROM Cursos WHERE ID_Instructor = ? AND Estado = 'Activo'");
$stmt->bind_param("i", $idInstructor);
$stmt->execute();
$result = $stmt->get_result();

$cursos = [];
while ($row = $result->fetch_assoc()) {
    $cursos[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode(["cursos" => $cursos]);
?>
