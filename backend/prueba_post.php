<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    echo "¡Solicitud POST recibida correctamente!";
} else {
    echo "Este archivo no acepta GET, usa POST.";
}
?>
