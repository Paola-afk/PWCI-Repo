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
        if (isset($_POST['accion'])) {
            if ($_POST['accion'] === 'crear') {
                createCurso($conn);
            } elseif ($_POST['accion'] === 'editar') {
                updateCurso($conn);
            } else {
                echo json_encode(["message" => "Acción no reconocida"]);
            }
        } else {
            echo json_encode(["message" => "Acción no especificada"]);
        }
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
        if (!empty($_POST['Titulo']) && !empty($_POST['Descripcion']) && isset($_POST['Costo']) && isset($_POST['Categoria'])) {
            // Obtener y validar los datos del formulario
            $titulo = trim($_POST['Titulo']);
            $descripcion = trim($_POST['Descripcion']);
            $costo = (float) $_POST['Costo']; // Asegúrate de que el costo sea un número válido
            $nivel = isset($_POST['Nivel']) ? (int) $_POST['Nivel'] : 1;
            $estado = isset($_POST['Estado']) ? trim($_POST['Estado']) : 'Activo';
            $categoria = (int) $_POST['Categoria'];  // La categoría seleccionada

            // Manejo de la imagen
            $imagenPath = null;
            if (isset($_FILES['Imagen']) && $_FILES['Imagen']['error'] === UPLOAD_ERR_OK) {
                $uploadDir = "uploads/"; // Directorio donde se almacenarán las imágenes
                $imagenPath = $uploadDir . basename($_FILES['Imagen']['name']);

                // Intentar mover el archivo al directorio
                if (!move_uploaded_file($_FILES['Imagen']['tmp_name'], $imagenPath)) {
                    echo json_encode(["message" => "Error al subir la imagen"]);
                    return;
                }
            }

            // Preparar la consulta para insertar el curso
            $query = "INSERT INTO Cursos (ID_Instructor, Titulo, Descripcion, Costo, Nivel, Estado, Imagen) VALUES (?, ?, ?, ?, ?, ?, ?)";

            if ($stmt = $conn->prepare($query)) {
                try {
                    // Enlazar los parámetros y ejecutar la consulta
                    $stmt->bind_param('issdsss', $_SESSION['id_usuario'], $titulo, $descripcion, $costo, $nivel, $estado, $imagenPath);
                    $stmt->execute();

                    // Verificar si la inserción fue exitosa
                    if ($stmt->affected_rows > 0) {
                        // Obtener el ID del curso recién creado
                        $idCurso = $stmt->insert_id;

                        // Ahora asociamos el curso con la categoría seleccionada
                        $queryCategoria = "INSERT INTO Curso_categoria (ID_Curso, ID_Categoria) VALUES (?, ?)";
                        $stmtCategoria = $conn->prepare($queryCategoria);
                        $stmtCategoria->bind_param('ii', $idCurso, $categoria);
                        $stmtCategoria->execute();

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
    // Verificar permisos de escritura (rol instructor)
    if (isset($_SESSION['id_usuario']) && $_SESSION['rol'] == 2) { 
        // Validar que el ID del curso esté presente
        if (!empty($_POST['idCurso'])) {
            $idCurso = (int) $_POST['idCurso'];
            $titulo = isset($_POST['tituloCurso']) ? trim($_POST['tituloCurso']) : null;
            $descripcion = isset($_POST['descripcionCurso']) ? trim($_POST['descripcionCurso']) : null;
            $costo = isset($_POST['costoCurso']) ? (float) $_POST['costoCurso'] : null;
            $nivel = isset($_POST['nivelCurso']) ? (int) $_POST['nivelCurso'] : null;

            // Validar campos obligatorios
            if (!$titulo || !$descripcion || is_null($costo) || is_null($nivel)) {
                echo json_encode(["message" => "Todos los campos son obligatorios"]);
                return;
            }

            // Manejo de la imagen
            $imagenPath = null;
            if (isset($_FILES['imagenCurso']) && $_FILES['imagenCurso']['error'] === UPLOAD_ERR_OK) {
                $uploadDir = "uploads/";
                $imagenPath = $uploadDir . basename($_FILES['imagenCurso']['name']);

                // Intentar mover el archivo al directorio
                if (!move_uploaded_file($_FILES['imagenCurso']['tmp_name'], $imagenPath)) {
                    echo json_encode(["message" => "Error al subir la imagen"]);
                    return;
                }
            }

            // Construir la consulta dinámica
            $query = "UPDATE Cursos SET Titulo = ?, Descripcion = ?, Costo = ?, Nivel = ?";
            $params = ['ssdi', $titulo, $descripcion, $costo, $nivel];

            if ($imagenPath) {
                $query .= ", Imagen = ?";
                $params[0] .= 's'; // Agregar tipo de dato para bind_param
                $params[] = $imagenPath;
            }

            $query .= " WHERE ID_Curso = ? AND ID_Instructor = ?";
            $params[0] .= 'ii';
            $params[] = $idCurso;
            $params[] = $_SESSION['id_usuario'];

            // Preparar y ejecutar la consulta
            $stmt = $conn->prepare($query);
            if ($stmt === false) {
                echo json_encode(["message" => "Error al preparar la consulta"]);
                return;
            }

            $stmt->bind_param(...$params);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Curso actualizado con éxito"]);
            } else {
                echo json_encode(["message" => "No se pudo actualizar el curso"]);
            }

            $stmt->close();
        } else {
            echo json_encode(["message" => "ID del curso es obligatorio"]);
        }
    } else {
        echo json_encode(["message" => "No autorizado o sin permisos de escritura"]);
    }
}





function deleteCurso($conn) {
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        parse_str(file_get_contents("php://input"), $deleteData);
        if (isset($deleteData['idCurso'])) {
            $idCurso = (int) $deleteData['idCurso'];
            $idInstructor = $_SESSION['id_usuario'];
    
            // Baja lógica: Cambiar el estado del curso a 'Inactivo'
            $query = "UPDATE Cursos SET Estado = 'Inactivo' WHERE ID_Curso = ? AND ID_Instructor = ?";
            $stmt = $conn->prepare($query);
            if ($stmt) {
                $stmt->bind_param('ii', $idCurso, $idInstructor);
                if ($stmt->execute()) {
                    echo json_encode(["message" => "Curso dado de baja con éxito"]);
                } else {
                    echo json_encode(["message" => "No se pudo dar de baja el curso"]);
                }
                $stmt->close();
            } else {
                echo json_encode(["message" => "Error al preparar la consulta"]);
            }
        } else {
            echo json_encode(["message" => "ID del curso es obligatorio"]);
        }
    }
    
}
?>
