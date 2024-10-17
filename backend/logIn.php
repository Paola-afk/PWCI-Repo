<?php
session_start();
include 'conexion.php'; // Conexión a la base de datos

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $contrasena = mysqli_real_escape_string($conn, $_POST['password']);

    // Llamar al Stored Procedure
    $sql = "CALL sp_iniciar_sesion(?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $email, $contrasena);
    $stmt->execute();
    $result = $stmt->get_result();
    $usuario = $result->fetch_assoc();
    
    if ($usuario['Rol'] != -1) {
        // Guardar el rol en la sesión
        $_SESSION['id_usuario'] = $usuario['ID_Usuario']; // Suponiendo que ID_Usuario se obtiene en el procedimiento
        $_SESSION['rol'] = $usuario['Rol']; // Guardar el rol del usuario

        // Redirigir a una página específica según el rol
        switch ($usuario['Rol']) {
            case 1: // Administrador
                header('Location: admin_dashboard.php');
                break;
            case 2: // Instructor
                header('Location: instructor_dashboard.php');
                break;
            case 3: // Estudiante
                header('Location: estudiante_dashboard.php');
                break;
            default:
                header('Location: general_dashboard.php'); // Página general para todos
                break;
        }
        exit();
    } else {
        echo "Correo o contraseña incorrectos.";
    }

    $stmt->close();
    $conn->close();
}
?>
