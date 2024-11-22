<?php
include('../get_session.php'); // Incluir archivo para verificar sesión y rol
include_once '../conexion.php'; // Conexión a la base de datos

header("Content-Type: application/json");

// Accede a los datos de sesión directamente desde `$data`
if (!$data['loggedIn']) {
    echo json_encode(["message" => "No autorizado"]);
    exit;
}

$request_method = $_SERVER["REQUEST_METHOD"];

switch($request_method) {
    case 'GET':
        $response = [
            "cursosActivos" => getCursos($conn),
            "cursosImpartidos" => getCursosImpartidos($conn)
        ];
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        break;    
    case 'POST':
        createCurso($conn);
        break;
    case 'PUT':
        updateCurso($conn);
        break;
    case 'DELETE':
        deleteCurso($conn);
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getCursos($conn) {
    $query = "SELECT * FROM Cursos WHERE Estado = 'Activo'";
    $result = $conn->query($query);
    
    $cursos = [];
    while ($row = $result->fetch_assoc()) {
        $cursos[] = $row;
    }

    return $cursos; // Retorna los datos en lugar de imprimirlos
}


function getCursosImpartidos($conn) {
    if (isset($_SESSION['id_usuario'])) {
        $id_instructor = $_SESSION['id_usuario'];

        $query = "SELECT 
                        c.ID_Curso, 
                        c.Titulo, 
                        IFNULL(cat.Nombre_Categoria, 'Sin Categoría') AS Categoria, 
                        c.Descripcion, 
                        c.Estado
                    FROM 
                        Cursos c
                    LEFT JOIN 
                        Curso_categoria cc ON c.ID_Curso = cc.ID_Curso
                    LEFT JOIN 
                        Categorias cat ON cc.ID_Categoria = cat.ID_Categoria
                    WHERE 
                        c.ID_Instructor = ?";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param('i', $id_instructor);
        $stmt->execute();
        $result = $stmt->get_result();

        $cursos = [];
        while ($row = $result->fetch_assoc()) {
            $cursos[] = $row;
        }

        return $cursos; // Retorna los datos en lugar de imprimirlos
    }

    return []; // Retorna un arreglo vacío si no hay usuario
}


function createCurso($conn) {
    // Verificar que el usuario esté autenticado y sea un instructor
    if (isset($_SESSION['id_usuario']) && $_SESSION['rol'] == 2) { // Supongamos que '2' es el rol del instructor
        // Verificar que se reciban los datos necesarios
        if (!empty($_POST['Titulo']) && !empty($_POST['Descripcion']) && isset($_POST['Costo'])) {
            // Obtener y validar los datos del formulario
            $titulo = trim($_POST['Titulo']);
            $descripcion = trim($_POST['Descripcion']);
            $costo = (float) $_POST['Costo']; // Asegúrate de que el costo sea un número válido
            $nivel = isset($_POST['Nivel']) ? (int) $_POST['Nivel'] : 1;
            $estado = isset($_POST['Estado']) ? trim($_POST['Estado']) : 'Activo';

            // Preparar la consulta para insertar el curso
            $query = "INSERT INTO Cursos (ID_Instructor, Titulo, Descripcion, Costo, Nivel, Estado) VALUES (?, ?, ?, ?, ?, ?)";
            
            if ($stmt = $conn->prepare($query)) {
                try {
                    // Enlazar los parámetros y ejecutar la consulta
                    $stmt->bind_param('issdss', $_SESSION['id_usuario'], $titulo, $descripcion, $costo, $nivel, $estado);
                    $stmt->execute();

                    // Verificar si la inserción fue exitosa
                    if ($stmt->affected_rows > 0) {
                        echo json_encode(["message" => "Curso creado con éxito"]);
                    } else {
                        echo json_encode(["message" => "No se pudo crear el curso"]);
                    }
                } catch (Exception $e) {
                    echo json_encode(["message" => "Error al crear el curso: " . $e->getMessage()]);
                } finally {
                    $stmt->close();
                }
            } else {
                echo json_encode(["message" => "Error al preparar la consulta"]);
            }
        } else {
            echo json_encode(["message" => "Faltan datos para crear el curso"]);
        }
    } else {
        echo json_encode(["message" => "Usuario no autorizado o no autenticado"]);
    }
}

function updateCurso($conn) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->ID_Curso)) {
        $query = "UPDATE Cursos SET Titulo = ?, Descripcion = ?, Costo = ?, Nivel = ?, Estado = ? WHERE ID_Curso = ?";
        $stmt = $conn->prepare($query);
        
        $stmt->bind_param('sssdsd', $data->Titulo, $data->Descripcion, $data->Costo, $data->Nivel, $data->Estado, $data->ID_Curso);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Curso actualizado con éxito"]);
        } else {
            echo json_encode(["message" => "No se pudo actualizar el curso"]);
        }
    } else {
        echo json_encode(["message" => "ID de curso es obligatorio"]);
    }
}

function deleteCurso($conn) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->ID_Curso)) {
        $query = "UPDATE Cursos SET Estado = 'Inactivo' WHERE ID_Curso = ?";
        $stmt = $conn->prepare($query);
        
        $stmt->bind_param('d', $data->ID_Curso);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Curso desactivado con éxito"]);
        } else {
            echo json_encode(["message" => "No se pudo desactivar el curso"]);
        }
    } else {
        echo json_encode(["message" => "ID de curso es obligatorio"]);
    }
}
?>
