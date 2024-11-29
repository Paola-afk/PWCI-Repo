<?php
require_once 'conexion.php';
global $pdo;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id_categoria'];

    try {
        $stmt = $pdo->prepare("CALL EliminarCategoria(:id_categoria)");
        $stmt->bindParam(':id_categoria', $id_categoria, PDO::PARAM_INT);
        $stmt->execute();


        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al eliminar la categoría']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
