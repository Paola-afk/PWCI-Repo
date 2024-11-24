<?php
include 'conexion.php';  // Asegúrate de que la conexión a la base de datos esté incluida

header('Content-Type: application/json');

// Verifica si el parámetro 'curso_id' está presente en la URL
if (isset($_GET['curso_id'])) {
    $curso_id = $_GET['curso_id'];  // Obtener el id del curso desde la URL

    // Consulta para obtener los niveles del curso especificado
    $sql = "SELECT * FROM niveles WHERE curso_id = ?";  // Filtramos por 'curso_id'
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $curso_id);  // Asignamos el 'curso_id' como parámetro
    $stmt->execute();
    $result = $stmt->get_result();
    
    // Comprobamos si hay niveles y los devolvemos
    $niveles = $result->fetch_all(MYSQLI_ASSOC);  // Obtenemos todos los niveles en un array

    if ($niveles) {
        echo json_encode(['niveles' => $niveles]);  // Devolvemos los niveles en formato JSON
    } else {
        echo json_encode(['niveles' => []]); // Si no hay niveles, devolvemos un array vacío
    }

} else {
    // Si no se proporciona el 'curso_id', devolvemos un error
    echo json_encode(['error' => 'No se proporcionó un ID de curso']);
}

$conn->close();  // Cerramos la conexión a la base de datos
?>
