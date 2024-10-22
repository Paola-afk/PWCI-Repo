<?php
session_start();
include 'conexion.php'; // Archivo de conexión a la base de datos

// Verificar si el usuario ha iniciado sesión
if (isset($_SESSION['id_usuario'])) {
    $id_usuario = $_SESSION['id_usuario'];

    // Obtener los detalles del usuario (nombre, avatar, rol) desde la base de datos
    $query = "SELECT Nombre_Completo, Avatar, ID_Rol FROM Usuarios WHERE ID_Usuario = ?";
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("i", $id_usuario);
        $stmt->execute();
        $stmt->bind_result($nombre, $avatar, $rol);
        $stmt->fetch();
        $stmt->close();
    }

    // Asignar valores para usar en JavaScript o en el HTML
    $avatar_url = !empty($avatar) ? $avatar : '/Multimedia/avatar.jpg'; // Ruta al avatar por defecto si no tiene uno
    $nombre_usuario = $nombre;
    $rol_usuario = $rol;
} else {
    // Si no ha iniciado sesión, redirigir al inicio de sesión
    header("Location: /logIn/logIn.html");
    exit();
}
?>
