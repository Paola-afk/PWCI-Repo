<?php
// Tu API Key de PDF.co
$apiKey = 'paolaj.carvajalguevara@gmail.com_KqUO01UtfIOw53QHGZouoiVh85Gyu8PjtfBcR9Td2VJW28J8uF8tf07YdscGNHfF';  // Reemplaza con tu API Key real

// URL de la API de PDF.co para generar el certificado
$url = 'https://api.pdf.co/v1/pdf/convert/from/html';

// Datos del certificado
$studentName = 'Juan Perez';
$courseName = 'Curso de PHP Avanzado';
$instructorName = 'Carlos Lopez';
$completionDate = '2024-11-30';

// Crear contenido HTML para el certificado
$htmlContent = "
    <html>
    <body>
        <h1>Certificado de Finalización</h1>
        <p>Este certificado confirma que:</p>
        <h2>$studentName</h2>
        <p>Ha completado satisfactoriamente el curso:</p>
        <h3>$courseName</h3>
        <p>Instructor: $instructorName</p>
        <p>Fecha de Finalización: $completionDate</p>
    </body>
    </html>
";

// Configurar los datos de la solicitud POST
$data = array(
    'name' => 'Certificado_$studentName.pdf',  // Nombre del archivo PDF
    'html' => $htmlContent,  // El contenido HTML del certificado
    'async' => false         // Si quieres que sea síncrono o asíncrono
);

// Iniciar cURL para hacer la solicitud
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'x-api-key: ' . $apiKey,  // Añadir la API Key en los encabezados
    'Content-Type: application/json'  // El contenido es JSON
));

// Ejecutar la solicitud
$response = curl_exec($ch);

// Verificar si hay errores
if(curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
} else {
    $responseData = json_decode($response, true);
    
    // Verificar si la respuesta fue exitosa
    if ($responseData['error'] === false) {
        $pdfUrl = $responseData['url'];  // URL del PDF generado
        echo "Certificado generado correctamente. Puedes descargarlo desde: $pdfUrl";
    } else {
        echo "Hubo un error al generar el certificado: " . $responseData['message'];
    }
}

// Cerrar la conexión cURL
curl_close($ch);
?>
