<?php
// Conexión a la base de datos
include 'conexion.php';

// Obtener los valores de búsqueda y filtros
$searchQuery = isset($_GET['q']) ? $_GET['q'] : '';
$categoria = isset($_GET['categoria']) ? $_GET['categoria'] : '';
$usuario = isset($_GET['usuario']) ? $_GET['usuario'] : '';
$fechaInicio = isset($_GET['fecha_inicio']) ? $_GET['fecha_inicio'] : '';
$fechaFin = isset($_GET['fecha_fin']) ? $_GET['fecha_fin'] : '';

// Construir la consulta SQL
$sql = "SELECT Cursos.*, Usuarios.Nombre AS InstructorNombre
        FROM Cursos
        JOIN Usuarios ON Cursos.ID_Instructor = Usuarios.ID_Usuario
        WHERE Cursos.Estado = 'Activo'";

// Añadir los filtros a la consulta
if ($searchQuery) {
    $sql .= " AND Cursos.Titulo LIKE ?";
}

if ($categoria) {
    $sql .= " AND Cursos.ID_Categoria = ?";
}

if ($usuario) {
    $sql .= " AND Cursos.ID_Instructor = ?";
}

if ($fechaInicio && $fechaFin) {
    $sql .= " AND Cursos.Fecha_Creacion BETWEEN ? AND ?";
}

$stmt = $pdo->prepare($sql);

// Vincular los parámetros para evitar inyecciones SQL
$params = [];
if ($searchQuery) $params[] = "%$searchQuery%";
if ($categoria) $params[] = $categoria;
if ($usuario) $params[] = $usuario;
if ($fechaInicio && $fechaFin) {
    $params[] = $fechaInicio;
    $params[] = $fechaFin;
}

$stmt->execute($params);

// Obtener los resultados
$cursos = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Obtener categorías y usuarios para los filtros
$categoriasResult = $pdo->query("SELECT * FROM Categorias")->fetchAll(PDO::FETCH_ASSOC);
$usuariosResult = $pdo->query("SELECT * FROM Usuarios")->fetchAll(PDO::FETCH_ASSOC);

// Incluir la página HTML para mostrar los resultados
include 'http://localhost/PWCI-Repo/busqueda/busqueda.html';
?>
