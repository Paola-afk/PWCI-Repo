<?php
function enviarCorreoCertificado($email, $nombre, $urlCertificado) {
    $subject = "¡Tu Certificado está Listo!";
    $message = "Hola $nombre,\n\n" .
               "Felicidades por completar el curso. Puedes descargar tu certificado aquí:\n" .
               "$urlCertificado\n\n" .
               "Atentamente,\nEl equipo de SkillHub";
    $headers = "From: no-reply@skillhub.com";

    mail($email, $subject, $message, $headers);
}
?>
