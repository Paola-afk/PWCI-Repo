<?php
include 'conexion.php';

header('Content-Type: application/json');

$sql = "SELECT ID_Usuario, Nombre_Completo, ID_Rol FROM Usuarios";
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
