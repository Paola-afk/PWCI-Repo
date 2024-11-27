<?php
include '../conexion.php';


// Obtener categorías
$categorias = $pdo->query("SELECT ID_Categoria, Nombre_Categoria FROM Categorias")->fetchAll(PDO::FETCH_ASSOC);

// Obtener usuarios (instructores)
$usuarios = $pdo->query("SELECT ID_Usuario, Nombre_Completo FROM Usuarios WHERE ID_Rol = (SELECT ID_Rol FROM Roles WHERE Nombre = 'Instructor')")->fetchAll(PDO::FETCH_ASSOC);

// Devolver ambos en formato JSON
echo json_encode([
    'categorias' => $categorias,
    'usuarios' => $usuarios,
]);
?>
