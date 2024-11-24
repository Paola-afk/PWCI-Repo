<?php
include 'conexion.php';  // Asegúrate de incluir la conexión a la base de datos

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        $id = $_GET['id'];  // Obtener el id del nivel desde la URL
        error_log("ID recibido para obtener nivel: $id");

        // Consulta para obtener los datos del nivel
        $sql = "SELECT * FROM niveles WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);  // Usamos el parámetro 'id'
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Si el nivel existe, devolver los datos como JSON
            $nivel = $result->fetch_assoc();
            echo json_encode($nivel);
        } else {
            error_log("No se encontró nivel con ID: $id");
            echo json_encode(['error' => 'Nivel no encontrado']);
        }
    } else {
        error_log("ID no proporcionado en la solicitud GET");
        echo json_encode(['error' => 'ID de nivel no proporcionado']);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['id'], $_POST['titulo'], $_POST['contenido'])) {
        $id = $_POST['id'];
        $titulo = $_POST['titulo'];
        $contenido = $_POST['contenido'];

        error_log("Datos recibidos para actualizar nivel: ID=$id, Título=$titulo, Contenido=$contenido");

        // Manejar archivos
        $video = isset($_FILES['video']) ? $_FILES['video'] : null;
        $material = isset($_FILES['material']) ? $_FILES['material'] : null;

        // Actualizar en la base de datos
        $sql = "UPDATE niveles SET titulo = ?, contenido = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssi", $titulo, $contenido, $id);

        if ($stmt->execute()) {
            error_log("Nivel actualizado correctamente en la base de datos");

            // Subir video
            if ($video) {
                $videoPath = 'uploads/videos/' . $video['name'];
                if (move_uploaded_file($video['tmp_name'], $videoPath)) {
                    $sql = "UPDATE niveles SET video = ? WHERE id = ?";
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("si", $videoPath, $id);
                    $stmt->execute();
                    error_log("Video subido y actualizado: $videoPath");
                } else {
                    error_log("Error al subir el video");
                }
            }

            // Subir material
            if ($material) {
                $materialPath = 'uploads/material/' . $material['name'];
                if (move_uploaded_file($material['tmp_name'], $materialPath)) {
                    $sql = "UPDATE niveles SET documento = ? WHERE id = ?";
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("si", $materialPath, $id);
                    $stmt->execute();
                    error_log("Material subido y actualizado: $materialPath");
                } else {
                    error_log("Error al subir el material");
                }
            }

            echo json_encode(['success' => true]);
        } else {
            error_log("Error al actualizar nivel en la base de datos");
            echo json_encode(['success' => false, 'error' => 'No se pudo actualizar el nivel']);
        }
    } else {
        error_log("Datos incompletos para actualizar el nivel");
        echo json_encode(['error' => 'Datos incompletos para actualizar el nivel']);
    }
}

?>