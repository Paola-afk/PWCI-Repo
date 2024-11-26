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
    // Manejar el archivo adjunto si existe
    $archivo_ruta = null;
    if ($archivo && $archivo['error'] === UPLOAD_ERR_OK) {
        $ruta_destino = '../archivos_mensajes/';
        if (!is_dir($ruta_destino)) {
            mkdir($ruta_destino, 0777, true);
        }
        $nombre_archivo = uniqid() . '_' . basename($archivo['name']);
        $archivo_ruta = $ruta_destino . $nombre_archivo;
        move_uploaded_file($archivo['tmp_name'], $archivo_ruta);
    }

    // Insertar mensaje en la base de datos
    $query = "
        INSERT INTO Mensajes (ID_Remitente, ID_Destinatario, ID_Curso, Mensaje, Archivo, Fecha_envio)
        VALUES (:id_instructor, :destinatario_id, :id_curso, :mensaje, :archivo, NOW());
    ";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':id_instructor', $id_instructor, PDO::PARAM_INT);
    $stmt->bindParam(':destinatario_id', $destinatario_id, PDO::PARAM_INT);
    $stmt->bindParam(':id_curso', $id_curso, PDO::PARAM_INT);
    $stmt->bindParam(':mensaje', $mensaje, PDO::PARAM_STR);
    $stmt->bindParam(':archivo', $archivo_ruta, PDO::PARAM_STR);

    $stmt->execute();
    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
