<?php
class Curso {
    private $conn;
    private $table_name = "Cursos";

    public $id;
    public $titulo;
    public $categoria;
    public $usuario_id;
    public $fecha_publicacion;
    public $activo;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Obtener todos los cursos activos
    public function getAllCourses() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE activo = 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Crear un nuevo curso
    public function createCourse() {
        $query = "INSERT INTO " . $this->table_name . " SET
                titulo = :titulo,
                categoria = :categoria,
                usuario_id = :usuario_id,
                fecha_publicacion = :fecha_publicacion,
                activo = :activo";

        $stmt = $this->conn->prepare($query);

        $this->titulo = htmlspecialchars(strip_tags($this->titulo));
        $this->categoria = htmlspecialchars(strip_tags($this->categoria));
        $this->usuario_id = htmlspecialchars(strip_tags($this->usuario_id));
        $this->fecha_publicacion = htmlspecialchars(strip_tags($this->fecha_publicacion));
        $this->activo = htmlspecialchars(strip_tags($this->activo));

        $stmt->bindParam(':titulo', $this->titulo);
        $stmt->bindParam(':categoria', $this->categoria);
        $stmt->bindParam(':usuario_id', $this->usuario_id);
        $stmt->bindParam(':fecha_publicacion', $this->fecha_publicacion);
        $stmt->bindParam(':activo', $this->activo);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Obtener detalles de un curso específico
    public function getCourseById() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->titulo = $row['titulo'];
            $this->categoria = $row['categoria'];
            $this->usuario_id = $row['usuario_id'];
            $this->fecha_publicacion = $row['fecha_publicacion'];
            $this->activo = $row['activo'];
            return true;
        }

        return false;
    }

    // Actualizar un curso
    public function updateCourse() {
        $query = "UPDATE " . $this->table_name . " SET
                titulo = :titulo,
                categoria = :categoria,
                usuario_id = :usuario_id,
                fecha_publicacion = :fecha_publicacion,
                activo = :activo
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $this->titulo = htmlspecialchars(strip_tags($this->titulo));
        $this->categoria = htmlspecialchars(strip_tags($this->categoria));
        $this->usuario_id = htmlspecialchars(strip_tags($this->usuario_id));
        $this->fecha_publicacion = htmlspecialchars(strip_tags($this->fecha_publicacion));
        $this->activo = htmlspecialchars(strip_tags($this->activo));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(':titulo', $this->titulo);
        $stmt->bindParam(':categoria', $this->categoria);
        $stmt->bindParam(':usuario_id', $this->usuario_id);
        $stmt->bindParam(':fecha_publicacion', $this->fecha_publicacion);
        $stmt->bindParam(':activo', $this->activo);
        $stmt->bindParam(':id', $this->id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Eliminar un curso
    public function deleteCourse() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(':id', $this->id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
?>
