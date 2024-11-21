<?php
include 'conexion.php'; // Archivo de conexión a la base de datos
require_once 'cursos.php';
require_once 'cursosControl.php';
require_once 'C:/xampp/htdocs/BDM-/vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

// Configurar encabezados
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Obtener la conexión a la base de datos
$database = new Database();
$db = $database->getConnection();

// Instanciar el controlador de cursos
$coursesController = new CursosControl($db);

// Obtener el método HTTP y la ruta
$method = $_SERVER['REQUEST_METHOD'];
$request = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Rutas de la API
switch ($request) {
    case '/BDM-/Backend/API/api.php/courses': {
        if ($method == 'GET') {
            // Verificar el token JWT
            $headers = getallheaders();
            if (isset($headers['Authorization'])) {
                $token = str_replace('Bearer ', '', $headers['Authorization']);
                try {
                    $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET_KEY'], 'HS256'));
                    $coursesController->getAllCourses();
                } catch (Exception $e) {
                    http_response_code(401);
                    echo json_encode(array("message" => "Token no válido o expirado"));
                }
            } else {
                http_response_code(401);
                echo json_encode(array("message" => "Se requiere autorización"));
            }
        } elseif ($method == 'POST') {
            $coursesController->createCourse();
        } else {
            http_response_code(405);
            echo json_encode(array("message" => "Método no permitido"));
        }
    }
        break;

    case preg_match('/^\/BDM\-\/Backend\/API\/api\.php\/course\/(\d+)$/', $request, $matches) ? true : false: {
        $courseId = $matches[1];
        if ($method == 'GET') {
            $coursesController->getCourse($courseId);
        } elseif ($method == 'PUT') {
            $coursesController->updateCourse($courseId);
        } elseif ($method == 'DELETE') {
            $coursesController->deleteCourse($courseId);
        } else {
            http_response_code(405);
            echo json_encode(array("message" => "Método no permitido"));
        }
    }
        break;

    default: {
        http_response_code(404);
        echo json_encode(array("message" => "Ruta no encontrada"));
    }
        break;
}
?>
