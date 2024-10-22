<?php
session_start();
if (isset($_SESSION['id_usuario'])) {
    echo json_encode([
        'loggedIn' => true,
        'ID Usuario'  => $_SESSION['id_usuario'],
        'rol' => $_SESSION['rol'],
        'avatar' => $_SESSION['avatar']
    ]);
} else {
    echo json_encode(['loggedIn' => false]);
}
?>