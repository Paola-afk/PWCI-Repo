<?php
include 'conexion.php'; // Archivo de conexión

// Ejecutar el procedimiento almacenado
$sql = "CALL ObtenerCategoriasYCursos()";
$result = $conn->query($sql);

// Inicializar el array de respuesta
$response = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Agrupar cursos bajo su categoría
        $categoria_id = $row['ID_Categoria'];
        if (!isset($response[$categoria_id])) {
            $response[$categoria_id] = [
                'ID_Categoria' => $row['ID_Categoria'],
                'Nombre_Categoria' => $row['Nombre_Categoria'],
                'Descripcion' => $row['Descripcion'],
                'Cursos' => []
            ];
        }

        // Agregar el curso a la categoría (si existe)
        if ($row['ID_Curso'] !== null) {
            $response[$categoria_id]['Cursos'][] = [
                'ID_Curso' => $row['ID_Curso'],
                'Titulo' => $row['Titulo'],
                'Imagen' => $row['Imagen']
            ];
        }
    }
}

// Devolver los datos como JSON
header('Content-Type: application/json');
echo json_encode(array_values($response));

$conn->close();
?>
