<?php
$host = '127.0.0.1'; 
$db = 'CapaWepa'; 
$user = 'root';
//$pass = '123456789';
$pass = '';

// Crear conexión
$conn = new mysqli($host, $user, $pass, $db);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
} 


try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}


function getPDO() { 
    $host = '127.0.0.1'; 
    $db = 'CapaWepa'; 
    $user = 'root'; 
    $pass = '123456789'; 
    $charset = 'utf8'; 

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset"; 
    $options = [ 
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]; 

    try { 
        $pdo = new PDO($dsn, $user, $pass, $options);
        return $pdo;
    } catch (PDOException $e) { 
        throw new PDOException($e->getMessage(), (int)$e->getCode());
    }
}


//echo "Wepa";
?>
