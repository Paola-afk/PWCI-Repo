<?php
include 'conexion.php';

$resultado = $conn->query("CALL GetCursosActivos()");

if (!$resultado) {
    die("Error en la consulta: " . $conn->error);
}

$cursos = array();

while ($fila = $resultado->fetch_assoc()) {
    $cursos[] = $fila;
}

echo json_encode($cursos);
?>
