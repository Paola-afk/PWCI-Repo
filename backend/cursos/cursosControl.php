<?php
class CursosControl {
    private $conn;
    private $curso;

    public function __construct($db) {
        $this->conn = $db;
        $this->curso = new Curso($db);
    }

    public function getAllCourses() {
        $stmt = $this->curso->getAllCourses();
        $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($courses);
    }

    public function createCourse() {
        $data = json_decode(file_get_contents("php://input"));
        
        $this->curso->titulo = $data->titulo;
        $this->curso->categoria = $data->categoria;
        $this->curso->usuario_id = $data->usuario_id;
        $this->curso->fecha_publicacion = $data->fecha_publicacion;
        $this->curso->activo = $data->activo;

        if ($this->curso->createCourse()) {
            echo json_encode(array("message" => "Curso creado correctamente."));
        } else {
            echo json_encode(array("message" => "No se pudo crear el curso."));
        }
    }

    public function getCourse($id) {
        $this->curso->id = $id;

        if ($this->curso->getCourseById()) {
            echo json_encode(array(
                "id" => $this->curso->id,
                "titulo" => $this->curso->titulo,
                "categoria" => $this->curso->categoria,
                "usuario_id" => $this->curso->usuario_id,
                "fecha_publicacion" => $this->curso->fecha_publicacion,
                "activo" => $this->curso->activo
            ));
        } else {
            echo json_encode(array("message" => "Curso no encontrado."));
        }
    }

    public function updateCourse($id) {
        $data = json_decode(file_get_contents("php://input"));
        
        $this->curso->id = $id;
        $this->curso->titulo = $data->titulo;
        $this->curso->categoria = $data->categoria;
        $this->curso->usuario_id = $data->usuario_id;
        $this->curso->fecha_publicacion = $data->fecha_publicacion;
        $this->curso->activo = $data->activo;

        if ($this->curso->updateCourse()) {
            echo json_encode(array("message" => "Curso actualizado correctamente."));
        } else {
            echo json_encode(array("message" => "No se pudo actualizar el curso."));
        }
    }

    public function deleteCourse($id) {
        $this->curso->id = $id;

        if ($this->curso->deleteCourse()) {
            echo json_encode(array("message" => "Curso eliminado correctamente."));
        } else {
            echo json_encode(array("message" => "No se pudo eliminar el curso."));
        }
    }
}
?>
