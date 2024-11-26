<?php
// Conexion a la base de datos
session_start();
include '../conexion.php';

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["success" => false, "error" => "Usuario no autenticado"]);
    exit;
}

$id_instructor = $_SESSION['id_usuario']; // ID del instructor logueado
$data = $_POST; // Para manejar texto y archivos
$destinatario_id = $data['destinatario_id'] ?? null;
$id_curso = $data['id_curso'] ?? null;
$mensaje = $data['mensaje'] ?? null;
$archivo = $_FILES['archivo'] ?? null;

if (!$destinatario_id || !$id_curso || !$mensaje) {
    echo json_encode(["success" => false, "error" => "Faltan datos obligatorios"]);
    exit;
}

try {
    // Verificar si ya existe una conversación entre el instructor y el destinatario para el curso
    $query = "SELECT ID_Conversacion 
              FROM Mensajes 
              WHERE (ID_Remitente = :id_instructor AND ID_Destinatario = :destinatario_id AND ID_Curso = :id_curso) 
              OR (ID_Destinatario = :destinatario_id AND ID_Remitente = :id_instructor AND ID_Curso = :id_curso) 
              LIMIT 1";
    
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':id_instructor', $id_instructor, PDO::PARAM_INT);
    $stmt->bindParam(':destinatario_id', $destinatario_id, PDO::PARAM_INT);
    $stmt->bindParam(':id_curso', $id_curso, PDO::PARAM_INT);
    $stmt->execute();
    
    // Si no existe una conversación, se genera un nuevo ID para la conversación
    $id_conversacion = null;
    if ($stmt->rowCount() == 0) {
        $id_conversacion = uniqid(); // Generar un nuevo ID único para la conversación
    } else {
        $chat = $stmt->fetch(PDO::FETCH_ASSOC);
        $id_conversacion = $chat['ID_Conversacion']; // Usar la conversación existente
    }

    // Manejar el archivo adjunto si existe
    $archivo_ruta = null;
    if ($archivo && $archivo['error'] === UPLOAD_ERR_OK) {
        $ruta_destino = '../uploads/';
        if (!is_dir($ruta_destino)) {
            mkdir($ruta_destino, 0777, true);
        }
        $nombre_archivo = uniqid() . '_' . basename($archivo['name']);
        $archivo_ruta = $ruta_destino . $nombre_archivo;
        move_uploaded_file($archivo['tmp_name'], $archivo_ruta);
    }

    // Insertar el mensaje en la base de datos, ya sea en una conversación nueva o existente
    $query = "
        INSERT INTO Mensajes (ID_Conversacion, ID_Remitente, ID_Destinatario, ID_Curso, Mensaje, Archivo, Fecha_envio)
        VALUES (:id_conversacion, :id_instructor, :destinatario_id, :id_curso, :mensaje, :archivo, NOW());
    ";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':id_conversacion', $id_conversacion, PDO::PARAM_STR);
    $stmt->bindParam(':id_instructor', $id_instructor, PDO::PARAM_INT);
    $stmt->bindParam(':destinatario_id', $destinatario_id, PDO::PARAM_INT);
    $stmt->bindParam(':id_curso', $id_curso, PDO::PARAM_INT);
    $stmt->bindParam(':mensaje', $mensaje, PDO::PARAM_STR);
    $stmt->bindParam(':archivo', $archivo_ruta, PDO::PARAM_STR);

    $stmt->execute();
    
    echo json_encode(["success" => true, "id_conversacion" => $id_conversacion]);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
