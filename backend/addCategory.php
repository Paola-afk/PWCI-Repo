<?php
session_start(); // Iniciar la sesión
require_once 'conexion.php';

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["success" => false, "message" => "No se ha encontrado el ID del administrador."]);
    exit;
}

try {
    $pdo = getPDO();

    $nombre_categoria = $_POST['nombre_categoria'];
    $descripcion = $_POST['descripcion'];
    $id_admin = $_SESSION['id_usuario']; // Obtener el ID del administrador desde la sesión

    // Verifica si ya existe una categoría con el mismo nombre
    $stmt = $pdo->prepare("SELECT 1 FROM Categorias WHERE Nombre_Categoria = :nombre_categoria");
    $stmt->execute(['nombre_categoria' => $nombre_categoria]);

    if ($stmt->fetchColumn()) {
        echo json_encode(["success" => false, "message" => "La categoría con ese nombre ya existe."]);
        exit;
    }

    // Inserta la nueva categoría
    $stmt = $pdo->prepare("INSERT INTO Categorias (Nombre_Categoria, Descripcion, ID_Admin) VALUES (:nombre_categoria, :descripcion, :id_admin)");
    $stmt->execute([
        'nombre_categoria' => $nombre_categoria,
        'descripcion' => $descripcion,
        'id_admin' => $id_admin
    ]);

    echo json_encode(["success" => true, "message" => "Categoría agregada exitosamente."]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
