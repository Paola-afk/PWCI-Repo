
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $id_remitente = $_POST['ID_Remitente'];   
    $id_destinatario = $_POST['ID_Destinatario']; 
    $id_curso = $_POST['ID_Curso'];          
    $mensaje = $_POST['Mensaje'];            

    if (empty($id_remitente) || empty($id_destinatario) || empty($mensaje)) {
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "Todos los campos son requeridos"]);
        exit;
    }

    // Inserción del mensaje en la base de datos
    $sql = "INSERT INTO Mensajes (ID_Remitente, ID_Destinatario, Mensaje, ID_Curso) 
            VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iisi", $id_remitente, $id_destinatario, $mensaje, $id_curso);

    if ($stmt->execute()) {
        http_response_code(201); 
        echo json_encode(["message" => "Mensaje enviado exitosamente"]);
    } else {
        http_response_code(500); 
        echo json_encode(["error" => "Error al enviar el mensaje"]);
    }
}
