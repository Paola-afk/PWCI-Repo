<?php
require_once '../conexion.php';

header('Content-Type: application/json'); 

if (!isset($_GET['id'])) {
    echo json_encode(["error" => "No se proporcionó un ID de curso."]);
    exit;
}

$idCurso = intval($_GET['id']);

// Consulta para obtener los detalles del curso, incluyendo el ID del instructor
$queryCurso = "
    SELECT 
        c.Titulo, 
        c.Descripcion, 
        c.Imagen, 
        c.Costo, 
        c.Nivel,
        IFNULL(SUM(k.Progreso), 0) AS Progreso,
        c.ID_Instructor  -- Agregar ID_Instructor
    FROM Cursos c
    LEFT JOIN Kardex k ON c.ID_Curso = k.ID_Curso
    WHERE c.ID_Curso = ?
    GROUP BY c.ID_Curso
";
$stmtCurso = $pdo->prepare($queryCurso);
$stmtCurso->execute([$idCurso]);

$curso = $stmtCurso->fetch(PDO::FETCH_ASSOC);

if (!$curso) {
    echo json_encode(["error" => "Curso no encontrado."]);
    exit;
}

// Consulta para obtener los niveles y su contenido
$queryNiveles = "
    SELECT 
        n.Titulo AS NivelNombre,
        n.Contenido,
        n.Video,
        n.Documento
    FROM Niveles n
    WHERE n.ID_Curso = ? AND n.Estado = 'activo'
";
$stmtNiveles = $pdo->prepare($queryNiveles);
$stmtNiveles->execute([$idCurso]);

$niveles = [];
while ($row = $stmtNiveles->fetch(PDO::FETCH_ASSOC)) {
    $niveles[] = [
        "Nombre" => $row['NivelNombre'],
        "Contenido" => $row['Contenido'],
        "Video" => $row['Video'],
        "Documento" => $row['Documento']
    ];
}

$curso['Niveles'] = $niveles;

// Agregar el ID del instructor a la respuesta
$curso['ID_Instructor'] = $curso['ID_Instructor'];

// Enviar la respuesta como JSON
echo json_encode($curso, JSON_UNESCAPED_SLASHES);
?>
