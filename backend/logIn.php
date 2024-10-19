<?php
session_start();
include 'conexion.php'; // Conexión a la base de datos

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Obtener los datos del formulario
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = mysqli_real_escape_string($conn, $_POST['password']);

    // Variables para almacenar los resultados del Stored Procedure
    $rol = null;
    $id_usuario = null;

    // Preparar el Stored Procedure
    $stmt = $conn->prepare("CALL sp_iniciar_sesion(?, @p_rol, @p_id_usuario)");
    $stmt->bind_param("s", $email); // Pasamos solo el email porque la contraseña se validará en PHP
    $stmt->execute();
    $stmt->close();

    // Obtener los resultados del Stored Procedure
    $result = $conn->query("SELECT @p_rol AS rol, @p_id_usuario AS id_usuario");
    $row = $result->fetch_assoc();

    $rol = $row['rol'];
    $id_usuario = $row['id_usuario'];

    // Si el usuario existe y está activo
    if ($id_usuario !== null) {
        // Obtener la contraseña almacenada en la base de datos
        $stmt = $conn->prepare("SELECT Contrasena FROM Usuarios WHERE Email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->bind_result($contrasena_hash);
        $stmt->fetch();
        $stmt->close();

        // Verificar la contraseña
        if (password_verify($password, $contrasena_hash)) {
            // Inicio de sesión exitoso
            $_SESSION['id_usuario'] = $id_usuario;
            $_SESSION['rol'] = $rol;

            // Redirigir al usuario a la página de inicio
            header("Location: http://localhost/PWCI-Repo/Inicio/inicio.html");
            exit();
        } else {
            // Contraseña incorrecta
            echo "Contraseña incorrecta.";
        }
    } else {
        // Usuario no encontrado o inactivo
        echo "Usuario no encontrado o inactivo.";
    }

    // Cerrar la conexión
    $conn->close();
}
?>
