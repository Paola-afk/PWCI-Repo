<?php
// Asegúrate de tener la clave API correcta
$apiKey = 'paolaj.carvajalguevara@gmail.com_3GByV32zNKhPvye63oQ5BPIR48j2nA8tW60Q85JBpINoFAMY4SCTheTH2KVnAyTN';
$url = 'https://api.pdf.co/v1/pdf/convert/from/html';

// Crear el contenido HTML para el certificado
$htmlContent = "
    <html>
    <body>
        <h1>Certificado de Finalización</h1>
        <p>Se otorga el presente certificado a:</p>
        <h2>Nombre del Estudiante</h2>
        <p>Por haber completado satisfactoriamente el curso:</p>
        <h3>Curso de Ejemplo</h3>
        <p>Fecha de finalización: " . date('d/m/Y') . "</p>
    </body>
    </html>
";

// Datos a enviar
$data = array(
    'name' => 'Certificado_Estudiante.pdf',
    'html' => $htmlContent,
    'async' => false
);

// Inicializar cURL
$ch = curl_init($url);

// Configuración de cURL
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'x-api-key: ' . $apiKey,
    'Content-Type: application/json'
));

// Ejecutar la solicitud y obtener la respuesta
$response = curl_exec($ch);

// Verificar si hubo errores en la solicitud
if(curl_errno($ch)) {
    echo 'Error en cURL: ' . curl_error($ch);
} else {
    // Convertir la respuesta JSON a un array
    $responseData = json_decode($response, true);
    
    // Verificar si la respuesta es exitosa
    if (isset($responseData['url'])) {
        echo "Certificado generado con éxito. Puedes descargarlo aquí: " . $responseData['url'];
    } else {
        echo "Error al generar el certificado: " . $responseData['message'];
    }
}

// Cerrar cURL
curl_close($ch);
?>
