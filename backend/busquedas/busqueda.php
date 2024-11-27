<?php
include '../conexion.php';

// Obtener los valores enviados por POST
$searchQuery = isset($_POST['q']) ? $_POST['q'] : '';
$categoria = isset($_POST['categoria']) ? $_POST['categoria'] : '';
$usuario = isset($_POST['usuario']) ? $_POST['usuario'] : '';
$fechaInicio = isset($_POST['fecha_inicio']) ? $_POST['fecha_inicio'] : '';
$fechaFin = isset($_POST['fecha_fin']) ? $_POST['fecha_fin'] : '';

// Construir la consulta SQL
$sql = "SELECT Cursos.*, Usuarios.Nombre_Completo AS InstructorNombre
        FROM Cursos
        JOIN Usuarios ON Cursos.ID_Instructor = Usuarios.ID_Usuario
        WHERE Cursos.Estado = 'Activo'";

// Array para los parámetros
$params = [];

// Agregar filtro de búsqueda por título
if ($searchQuery) {
    // Usar LIKE para buscar la palabra en el título
    $sql .= " AND Cursos.Titulo LIKE ?";
    $params[] = "%$searchQuery%"; // Agregar el valor de la búsqueda con comodín
}

// Agregar filtro por categoría (solo si se selecciona)
if ($categoria) {
    $sql .= " AND Cursos.ID_Curso IN (SELECT ID_Curso FROM Curso_categoria WHERE ID_Categoria = ?)";
    $params[] = $categoria;
}

// Agregar filtro por instructor (solo si se selecciona)
if ($usuario) {
    $sql .= " AND Cursos.ID_Instructor = ?";
    $params[] = $usuario;
}


// Filtrar por fechas (solo la parte de la fecha, ignorando la hora)
if ($fechaInicio && $fechaFin) {
    // Filtrar entre dos fechas (solo parte de la fecha)
    $sql .= " AND DATE(Cursos.Fecha_Creacion) BETWEEN ? AND ?";
    $params[] = $fechaInicio;  // Fecha de inicio
    $params[] = $fechaFin;     // Fecha de fin
} elseif ($fechaInicio) {
    // Filtrar solo por fecha de inicio
    $sql .= " AND DATE(Cursos.Fecha_Creacion) >= ?";
    $params[] = $fechaInicio;
} elseif ($fechaFin) {
    // Filtrar solo por fecha de fin
    $sql .= " AND DATE(Cursos.Fecha_Creacion) <= ?";
    $params[] = $fechaFin;
}

// Depuración: Mostrar la consulta SQL para verificar que se está generando correctamente
//echo "Consulta SQL: " . $sql . "<br>";
//echo "Parámetros: ";
//print_r($params);
//echo "<br>";


// Preparar y ejecutar la consulta
$stmt = $pdo->prepare($sql);
$stmt->execute($params);

// Devolver los resultados en formato JSON
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>