<?php
session_start();
require 'conexion.php'; // Asegúrate de incluir tu archivo de conexión a la base de datos

// Verifica si el usuario está logueado
if (!isset($_SESSION['id_usuario'])) {
    header('Location: /logIn/logIn.html'); // Redirige si no está logueado
    exit();
}
else {
    echo "Wepa";
}
// Obtén los datos del formulario
$id_usuario = $_SESSION['id_usuario'];
$nombre_completo = $_POST['full_name'];
$email = $_POST['email'];
$genero = $_POST['gender'];
$fecha_nacimiento = $_POST['dob'];
$contrasena = $_POST['password'];

// Opcional: encriptar la contraseña si es necesario
$contrasena_encriptada = password_hash($contrasena, PASSWORD_BCRYPT);

// Conectar a la base de datos
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Verifica si hay algún error en la conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Preparar el procedimiento almacenado
$sql = "CALL UpdateUsuario(?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("isssss", $id_usuario, $nombre_completo, $email, $genero, $fecha_nacimiento, $contrasena_encriptada);

// Ejecutar la consulta
if ($stmt->execute()) {
    echo "Perfil actualizado correctamente";
    // Redirigir o mostrar un mensaje de éxito
    header('Location: perfilUser.html?update=success');
} else {
    echo "Error al actualizar el perfil: " . $stmt->error;
}

// Cerrar la conexión
$stmt->close();
$conn->close();
?>
