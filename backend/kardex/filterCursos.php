<?php
session_start(); 
header('Content-Type: application/json');
include '../conexion.php'; // Cambia el path según tu estructura de proyecto

// Verificar que el usuario haya iniciado sesión
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(['error' => 'No has iniciado sesión.']);
    exit;
}

try {
    // Conexión a la base de datos (si ya está incluida en conexion.php, no necesitas crearla aquí)
    // $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass); // Eliminado porque ya está en conexion.php

    // Leer los datos enviados desde el frontend
    $data = json_decode(file_get_contents('php://input'), true);

    // Filtros recibidos
    $dateStart = isset($data['dateStart']) ? $data['dateStart'] : null;
    $dateEnd = isset($data['dateEnd']) ? $data['dateEnd'] : null;
    $category = isset($data['category']) && $data['category'] !== 'all' ? $data['category'] : null;
    $status = isset($data['status']) && $data['status'] !== 'all' ? $data['status'] : null;
    $active = isset($data['active']) && $data['active'] !== 'all' ? $data['active'] : null;

    $query = "
    SELECT c.ID_Curso, c.Titulo, c.Imagen, c.Nivel, k.Progreso, k.Fecha_Inscripcion, k.Ultimo_Acceso, k.Fecha_Terminacion
    FROM Cursos c
    INNER JOIN Kardex k ON c.ID_Curso = k.ID_Curso
    LEFT JOIN Curso_categoria cc ON c.ID_Curso = cc.ID_Curso
    LEFT JOIN Categorias cat ON cc.ID_Categoria = cat.ID_Categoria
    WHERE k.ID_Estudiante = :id_usuario
    ";
    



$conditions = [];
$params = [':id_usuario' => $_SESSION['id_usuario']];

if ($dateStart) {
    $conditions[] = "k.Fecha_Inscripcion >= :dateStart";
    $params[':dateStart'] = $dateStart;
}

if ($dateEnd) {
    $conditions[] = "k.Fecha_Inscripcion <= :dateEnd";
    $params[':dateEnd'] = $dateEnd;
}

if (!empty($data['category']) && $data['category'] !== 'all') {
    $conditions[] = "cat.ID_Categoria = :category";
    $params[':category'] = (int) $data['category']; // Aseguramos que sea un número
}




if ($status === 'completed') {
    $conditions[] = "k.Progreso = 100";
} elseif ($status === 'inprogress') {
    $conditions[] = "k.Progreso < 100";
}

if ($active === 'active') {
    $conditions[] = "c.Estado = 'Activo'";
} elseif ($active === 'inactive') {
    $conditions[] = "c.Estado = 'Inactivo'";
}

// Agregar condiciones a la consulta
if (!empty($conditions)) {
    $query .= " AND " . implode(' AND ', $conditions);
}


    // Preparar y ejecutar la consulta
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);

    // Obtener los resultados
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Enviar los resultados como JSON
    echo json_encode($courses);

} catch (Exception $e) {
    // Enviar un mensaje de error si algo falla
    echo json_encode(['error' => 'Error al obtener los cursos: ' . $e->getMessage()]);
}
?>
