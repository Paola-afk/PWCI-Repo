<?php
$host = '127.0.0.1'; 
$db = 'CapaWepa'; 
$user = 'root';
$pass = '';

// Crear conexión
$conn = new mysqli($host, $user, $pass, $db);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
} 

//echo "Wepa";
?>
