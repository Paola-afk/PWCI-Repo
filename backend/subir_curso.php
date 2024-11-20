<?php
header('Content-Type: application/json');
session_start();
include 'conexion.php'; // Archivo de conexión a la base de datos

// Verificar si se recibió una imagen
if (isset($_FILES['Imagen'])) {
    // Procesar la imagen del curso
    $imagen = $_FILES['Imagen'];
    $imagenPath = 'uploads/' . basename($imagen['name']);
    if (!move_uploaded_file($imagen['tmp_name'], $imagenPath)) {
        echo json_encode(['success' => false, 'message' => 'Error al subir la imagen']);
        exit();
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No se proporcionó ninguna imagen']);
    exit();
}

// Verificar si todos los datos necesarios están presentes
if (isset($_POST['ID_Instructor'], $_POST['Titulo'], $_POST['Descripcion'], $_POST['Costo'], $_POST['Nivel'], $_POST['Estado'])) {
    // Recibir datos del formulario
    $ID_Instructor = $_POST['ID_Instructor'];
    $Titulo = $_POST['Titulo'];
    $Descripcion = $_POST['Descripcion'];
    $Costo = $_POST['Costo'];
    $Nivel = $_POST['Nivel'];
    $Estado = $_POST['Estado'];

    // Llamar al procedimiento almacenado
    $sql = "CALL InsertarCurso(?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isssdii", $ID_Instructor, $Titulo, $Descripcion, $imagenPath, $Costo, $Nivel, $Estado);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al crear el curso: ' . $stmt->error]);
    }

    // Cerrar la conexión
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Faltan datos requeridos']);
}
?>
