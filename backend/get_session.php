<?php
session_start();

$data = [];
if (isset($_SESSION['id_usuario'])) {
    $data = [
        'loggedIn' => true,
        'ID_Usuario' => $_SESSION['id_usuario'],
        'Nombre' => $_SESSION['nombre_completo'],
        'Correo' => $_SESSION['email'],
        'rol' => $_SESSION['rol'],
        'avatar' => $_SESSION['avatar'],
        'Cumple' => $_SESSION['fecha_nacimiento'],
        'Genero' => $_SESSION['genero']
    ];
} else {
    $data = ['loggedIn' => false];
}

// Emitir JSON solo si se accede directamente al archivo
if (basename($_SERVER['PHP_SELF']) === 'get_session.php') {
    header("Content-Type: application/json");
    echo json_encode($data);
}
?>
