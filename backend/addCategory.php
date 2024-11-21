<?php 
include 'conexion.php';
session_start(); // Iniciar sesión para acceder a los datos del usuario

header('Content-Type: application/json');

// Asegurarse de que los errores se muestren durante la depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener el ID del usuario administrador desde la sesión
    $adminId = $_SESSION['id_usuario'] ?? null; 

    if (!$adminId) {
        echo json_encode(["status" => "error", "message" => "Usuario no autenticado"]);
        exit;
    }

    $nombreCategoria = $_POST['nombre_categoria'] ?? null;
    $descripcion = $_POST['descripcion'] ?? null;

    if (empty($nombreCategoria) || empty($descripcion)) {
        echo json_encode(["status" => "error", "message" => "Todos los campos son obligatorios"]);
        exit;
    }

    try {
        // Llamar al procedimiento almacenado y pasar el ID del administrador
        $sql = "CALL AddCategoria(:nombre_categoria, :descripcion, :id_admin)";
        $stmt = $pdo->prepare($sql);

        $stmt->bindParam(':nombre_categoria', $nombreCategoria, PDO::PARAM_STR);
        $stmt->bindParam(':descripcion', $descripcion, PDO::PARAM_STR);
        $stmt->bindParam(':id_admin', $adminId, PDO::PARAM_INT);

        $stmt->execute();

        echo json_encode(["status" => "success", "message" => "Categoría agregada exitosamente"]);
    } catch (PDOException $e) {
        // Devolver el mensaje de error del procedimiento almacenado
        echo json_encode(["status" => "error", "message" => "Error al agregar la categoría: " . $e->getMessage()]);
    }
}
?>
