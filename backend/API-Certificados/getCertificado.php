<?php
session_start();
include '../conexion.php'; // Configuración de la base de datos

// Verificar si el curso_id está presente en la URL
if (isset($_GET['curso_id'])) {
    $cursoId = $_GET['curso_id'];
} else {
    echo json_encode(['status' => 'error', 'message' => 'ID del curso no proporcionado.']);
    exit;
}

$usuarioId = $_SESSION['id_usuario']; // Obtener el ID del usuario desde la sesión

// Verificar si el curso está completado
$conn = new mysqli($host, $user, $pass, $db);
$sql = "SELECT * FROM Kardex WHERE ID_Estudiante = ? AND ID_Curso = ? AND Estado = 'Completado'";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $usuarioId, $cursoId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'El curso no está completado.']);
    exit;
}

// Obtener datos del usuario y curso para el certificado
$sql = "SELECT u.Nombre_Completo AS Usuario, c.Titulo AS Curso
        FROM Usuarios u
        JOIN Cursos c ON c.ID_Curso = ?
        WHERE u.ID_Usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $cursoId, $usuarioId);
$stmt->execute();
$data = $stmt->get_result()->fetch_assoc();

if (!$data) {
    echo json_encode(['status' => 'error', 'message' => 'No se encontraron datos del curso o usuario.']);
    exit;
}

$nombreEstudiante = $data['Usuario'];
$tituloCurso = $data['Curso'];
$fechaFinalizacion = date('d/m/Y');

// Crear contenido del certificado
$htmlContent = "
    <html>
    <body>
        <h1>Certificado de Finalización</h1>
        <p>Se otorga el presente certificado a:</p>
        <h2>$nombreEstudiante</h2>
        <p>Por haber completado satisfactoriamente el curso:</p>
        <h3>$tituloCurso</h3>
        <p>Fecha de finalización: $fechaFinalizacion</p>
    </body>
    </html>
";

// Llamada a la API de PDF.co
$apiKey = 'paolaj.carvajalguevara@gmail.com_3GByV32zNKhPvye63oQ5BPIR48j2nA8tW60Q85JBpINoFAMY4SCTheTH2KVnAyTN';
$url = 'https://api.pdf.co/v1/pdf/convert/from/html';
$data = array(
    'name' => 'Certificado_' . $nombreEstudiante . '.pdf',
    'html' => $htmlContent,
    'async' => false
);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'x-api-key: ' . $apiKey,
    'Content-Type: application/json'
));

$response = curl_exec($ch);

// Manejo de errores de cURL
if ($response === false) {
    $errorMessage = curl_error($ch);
    echo json_encode(['status' => 'error', 'message' => 'Error en la conexión con la API: ' . $errorMessage]);
    curl_close($ch);
    exit;
}

curl_close($ch);

$responseData = json_decode($response, true);

if (isset($responseData['url'])) {
    echo json_encode(['status' => 'success', 'url' => $responseData['url']]);
} else {
    $message = isset($responseData['message']) ? $responseData['message'] : 'Error desconocido';
    echo json_encode(['status' => 'error', 'message' => 'No se pudo generar el certificado: ' . $message]);
}
?>
