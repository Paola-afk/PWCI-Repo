<?php
session_start();
require '../conexion.php'; // Conexión a la base de datos

header("Content-Type: application/json");

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["success" => false, "error" => "Usuario no autenticado"]);
    exit;
}

$usuario = $_SESSION['id_usuario'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Enviar mensaje
    $remitente = $usuario; // El remitente es el usuario autenticado
    $destinatario = $_POST['id_destinatario'] ?? null;
    $curso = $_POST['id_curso'] ?? null;
    $mensaje = $_POST['mensaje'] ?? null;

    // Validar datos requeridos
    if (!$destinatario || !$curso || !$mensaje) {
        echo json_encode(["success" => false, "error" => "Faltan datos obligatorios."]);
        exit;
    }

    // Manejo de archivo (opcional)
    $archivo = null;
    if (isset($_FILES['archivo']) && $_FILES['archivo']['error'] === UPLOAD_ERR_OK) {
        $nombreArchivo = basename($_FILES['archivo']['name']);
        $rutaDestino = "../uploads/" . $nombreArchivo;

        if (move_uploaded_file($_FILES['archivo']['tmp_name'], $rutaDestino)) {
            $archivo = $rutaDestino; // Guardar la ruta del archivo
        } else {
            echo json_encode(["success" => false, "error" => "Error al subir el archivo."]);
            exit;
        }
    }

    // Insertar mensaje en la base de datos
    $sql = "INSERT INTO Mensajes (ID_Remitente, ID_Destinatario, ID_Curso, Mensaje, Archivo, Fecha_envio) 
            VALUES (?, ?, ?, ?, ?, NOW())";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iiiss", $remitente, $destinatario, $curso, $mensaje, $archivo);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Mensaje enviado."]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Obtener mensajes
    $curso = $_GET['id_curso'] ?? null;

    if (!$curso) {
        echo json_encode(["success" => false, "error" => "ID del curso no proporcionado."]);
        exit;
    }

    // Obtener los mensajes y los datos del instructor
    $sql = "SELECT M.*, U.Nombre_Completo, U.Avatar 
            FROM Mensajes M 
            JOIN Usuarios U ON M.ID_Remitente = U.ID_Usuario 
            WHERE ID_Curso = ? AND (ID_Remitente = ? OR ID_Destinatario = ?)
            ORDER BY Fecha_envio ASC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iii", $curso, $usuario, $usuario);
    $stmt->execute();
    $result = $stmt->get_result();

    $mensajes = [];
    while ($fila = $result->fetch_assoc()) {
        // Agregar datos de cada mensaje
        $mensajes[] = [
            'ID_Mensaje' => $fila['ID_Mensaje'],
            'Mensaje' => $fila['Mensaje'],
            'Fecha_envio' => $fila['Fecha_envio'],
            'ID_Remitente' => $fila['ID_Remitente'],
            'Nombre_Completo' => $fila['Nombre_Completo'],
            'Avatar' => $fila['Avatar'] ? "../" . $fila['Avatar'] : 'default-avatar.jpg', // Ruta de la imagen
        ];
    }

    // Obtener datos del instructor (si es necesario)
    $sqlInstructor = "SELECT u.Nombre_Completo, u.Avatar 
                      FROM Cursos c 
                      JOIN Usuarios u ON c.ID_Instructor = u.ID_Usuario 
                      WHERE c.ID_Curso = ?";
    $stmtInstructor = $conn->prepare($sqlInstructor);
    $stmtInstructor->bind_param("i", $curso);
    $stmtInstructor->execute();
    $resultInstructor = $stmtInstructor->get_result();
    $instructor = $resultInstructor->fetch_assoc();

    echo json_encode([
        "success" => true,
        "mensajes" => $mensajes,
        "instructorName" => $instructor['Nombre_Completo'],
        "instructorAvatar" => $instructor['Avatar'] ? "../" . $instructor['Avatar'] : 'default-avatar.jpg',
    ]);
} else {
    // Método no soportado
    echo json_encode(["success" => false, "error" => "Método no soportado."]);
}
?>
