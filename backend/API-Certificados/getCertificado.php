<?php
include '../conexion.php'; // Configuración de la base de datos

$data = json_decode(file_get_contents("php://input"), true);
$cursoId = $data['curso_id'];
$usuarioId = 1; // Aquí obtén el ID del usuario actual (de la sesión)

// Verificar si el curso está completado
$conn = new mysqli($host, $user, $pass, $db);
$sql = "SELECT * FROM Kardex WHERE ID_Usuario = ? AND ID_Curso = ? AND Estado = 'Completado'";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $usuarioId, $cursoId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'El curso no está completado.']);
    exit;
}

// Obtener datos del usuario y curso para el certificado
$sql = "SELECT u.Nombre AS Usuario, c.Titulo AS Curso
        FROM Usuarios u
        JOIN Cursos c ON c.ID_Curso = ?
        WHERE u.ID_Usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $cursoId, $usuarioId);
$stmt->execute();
$data = $stmt->get_result()->fetch_assoc();

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
$apiKey = 'paolaj.carvajalguevara@gmail.com_KqUO01UtfIOw53QHGZouoiVh85Gyu8PjtfBcR9Td2VJW28J8uF8tf07YdscGNHfF';
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
curl_close($ch);

$responseData = json_decode($response, true);
if (isset($responseData['url'])) {
    echo json_encode(['status' => 'success', 'url' => $responseData['url']]);
} else {
    echo json_encode(['status' => 'error', 'message' => $responseData['message']]);
}
?>
