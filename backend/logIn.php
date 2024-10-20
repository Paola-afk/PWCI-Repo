<?php
session_start();
include 'conexion.php'; // Conexión a la base de datos

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = mysqli_real_escape_string($conn, $_POST['password']);

    // Variables para el Stored Procedure
    $rol = null;
    $id_usuario = null;
    $contrasena_hash = null;

    // Llamar al Stored Procedure para obtener los datos del usuario
    if ($stmt = $conn->prepare("CALL sp_iniciar_sesion(?, @p_rol, @p_id_usuario, @p_contrasena_hash)")) {
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->close();

        // Obtener los resultados del Stored Procedure
        $result = $conn->query("SELECT @p_rol AS rol, @p_id_usuario AS id_usuario, @p_contrasena_hash AS contrasena_hash");
        $row = $result->fetch_assoc();

        $rol = $row['rol'];
        $id_usuario = $row['id_usuario'];
        $contrasena_hash = $row['contrasena_hash'];

        if ($id_usuario !== null && $contrasena_hash !== null) {
            // Verificar si la contraseña es correcta
            if (password_verify($password, $contrasena_hash)) {
                // Inicio de sesión exitoso
                $_SESSION['id_usuario'] = $id_usuario;
                $_SESSION['rol'] = $rol;
                echo "success";
            } else {
                // Contraseña incorrecta
                echo "password_incorrect";
            }
        } else {
            // Usuario no encontrado o no activo
            echo "user_not_found";
        }
    } else {
        // Error al preparar el Stored Procedure
        echo "unexpected_error";
    }

    $conn->close();
} else {
    echo "invalid_request";
}
?>


