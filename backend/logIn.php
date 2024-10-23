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
    $estado = null;
    $avatar = null;
    $nombre_completo = null;
    $genero = null;
    $fecha_nacimiento = null;

    // Llamar al Stored Procedure para obtener los datos del usuario
    if ($stmt = $conn->prepare("CALL sp_iniciar_sesion(?, @p_rol, @p_id_usuario, @p_contrasena_hash, @p_estado, @p_avatar, @p_nombre_completo, @p_genero, @p_fecha_nacimiento)")) {
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->close();

        // Obtener los resultados del Stored Procedure
        $result = $conn->query("SELECT @p_rol AS rol, @p_id_usuario AS id_usuario, @p_contrasena_hash AS contrasena_hash, @p_estado AS estado, @p_avatar AS avatar, @p_nombre_completo AS nombre_completo, @p_genero AS genero, @p_fecha_nacimiento AS fecha_nacimiento");
        $row = $result->fetch_assoc();

        $rol = $row['rol'];
        $id_usuario = $row['id_usuario'];
        $contrasena_hash = $row['contrasena_hash'];
        $estado = $row['estado'];
        $avatar = $row['avatar'];
        $nombre_completo = $row['nombre_completo'];
        $genero = $row['genero'];
        $fecha_nacimiento = $row['fecha_nacimiento'];

        if ($estado === 'Inactivo') {
            echo "user_blocked";
        } else if ($id_usuario !== null && $contrasena_hash !== null) {
            // Verificar si la contraseña es correcta
            if (password_verify($password, $contrasena_hash)) {
                // Inicio de sesión exitoso, resetear intentos fallidos
                $conn->query("UPDATE Usuarios SET intentos_fallidos = 0 WHERE Email = '$email'");
                
                // Asignar las variables de sesión correctamente
                $_SESSION['id_usuario'] = $id_usuario;
                $_SESSION['rol'] = $rol;
                $_SESSION['avatar'] = $avatar;
                $_SESSION['nombre_completo'] = $nombre_completo; // Almacena el nombre completo
                $_SESSION['genero'] = $genero; // Almacena el ID del género
                $_SESSION['fecha_nacimiento'] = $fecha_nacimiento; // Almacena la fecha de nacimiento

                echo "success";
            } else {
                // Contraseña incorrecta, incrementar intentos fallidos
                $conn->query("UPDATE Usuarios SET intentos_fallidos = intentos_fallidos + 1 WHERE Email = '$email'");
                echo "password_incorrect";
            }
        } else {
            // Usuario no encontrado o no activo
            echo "user_not_found";
        }
    } else {
        echo "unexpected_error";
    }

    $conn->close();
} else {
    echo "invalid_request";
}
?>
