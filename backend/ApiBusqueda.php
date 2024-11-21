<?php
session_start();
include 'conexion.php'; // Archivo de conexión a la base de datos
header('Content-Type: application/json');

function getCourses($pdo, $filters = []) {
    try {
        $query = "SELECT * FROM Cursos WHERE activo = 1";
        $params = [];

        if (!empty($filters['category'])) {
            $query .= " AND categoria = :category";
            $params[':category'] = $filters['category'];
        }

        if (!empty($filters['title'])) {
            $query .= " AND titulo LIKE :title";
            $params[':title'] = "%" . $filters['title'] . "%";
        }

        if (!empty($filters['user'])) {
            $query .= " AND usuario_id = :user";
            $params[':user'] = $filters['user'];
        }

        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $query .= " AND fecha_publicacion BETWEEN :start_date AND :end_date";
            $params[':start_date'] = $filters['start_date'];
            $params[':end_date'] = $filters['end_date'];
        }

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($courses);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getUsers($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM Usuarios");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($users);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

$pdo = getPDOConnection();

if (isset($_GET['action'])) {
    switch ($_GET['action']) {
        case 'getCourses':
            $filters = [
                'category' => $_GET['category'] ?? null,
                'title' => $_GET['title'] ?? null,
                'user' => $_GET['user'] ?? null,
                'start_date' => $_GET['start_date'] ?? null,
                'end_date' => $_GET['end_date'] ?? null,
            ];
            getCourses($pdo, $filters);
            break;
        case 'getUsers':
            getUsers($pdo);
            break;
        default:
            echo json_encode(['error' => 'Acción no válida']);
    }
} else {
    echo json_encode(['error' => 'No se especificó una acción']);
}
?>
