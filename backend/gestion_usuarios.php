<?php 
include 'conexion.php';

header('Content-Type: application/json');

// Verificar si se pasó alguna acción (como bloquear) y el ID de usuario
$action = isset($_GET['action']) ? $_GET['action'] : '';
$idUsuario = isset($_GET['id']) ? $_GET['id'] : 0;

// Si la acción es "bloquear", ejecutar la lógica de bloqueo
if ($action == 'bloquear') {
    // Llamar al procedimiento almacenado para bloquear al usuario
    $sql = "CALL BloquearUsuario($idUsuario)";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Usuario bloqueado con éxito']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al bloquear el usuario']);
    }
    $conn->close();
    exit;  // Terminar la ejecución aquí si es una acción específica

}

// Si no hay acción, simplemente devolver los usuarios
$sql = "SELECT ID_Usuario, Nombre_Completo, ID_Rol, Estado FROM Usuarios";
$result = $conn->query($sql);

$usuarios = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $usuarios[] = $row;
    }
}

echo json_encode($usuarios);

$conn->close();
?>
