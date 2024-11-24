<?php
require_once '../conexion.php';

header('Content-Type: application/json'); 

if (!isset($_GET['id'])) {
    echo json_encode(["error" => "No se proporcionó un ID de curso."]);
    exit;
}

$idCurso = intval($_GET['id']);

$query = "
    SELECT 
        c.Titulo, c.Descripcion, c.Imagen, c.Costo, c.Nivel,
        IFNULL(SUM(k.Progreso), 0) AS Progreso
    FROM Cursos c
    LEFT JOIN Kardex k ON c.ID_Curso = k.ID_Curso
    WHERE c.ID_Curso = ?
    GROUP BY c.ID_Curso
";
$stmt = $pdo->prepare($query);
$stmt->execute([$idCurso]);

$curso = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$curso) {
    echo json_encode(["error" => "Curso no encontrado."]);
    exit;
}

// Obtener los niveles del curso
$queryNiveles = "
    SELECT 
        n.Titulo AS NivelNombre
    FROM Niveles n
    WHERE n.ID_Curso = ?
";
$stmtNiveles = $pdo->prepare($queryNiveles);
$stmtNiveles->execute([$idCurso]);

$niveles = [];
while ($row = $stmtNiveles->fetch(PDO::FETCH_ASSOC)) {
    $niveles[] = [
        "Nombre" => $row['NivelNombre']
    ];
}

$curso['Niveles'] = $niveles;

// Enviar la respuesta como JSON
echo json_encode($curso, JSON_UNESCAPED_SLASHES);  // Usar JSON_UNESCAPED_SLASHES para evitar que las URLs se escapen
?>
