<?php
require(__DIR__ . "/vendor/autoload.php");
use Algolia\AlgoliaSearch\SearchClient;

// Configurar la conexión a la base de datos
include 'conexion.php'; // Archivo de conexión a la base de datos

// Conectar y autenticar con tu aplicación Algolia
$client = SearchClient::create('TU_APP_ID', 'TU_API_KEY');
$index = $client->initIndex('cursos_index');

// Obtener los cursos de la base de datos
$stmt = $pdo->query("SELECT * FROM Cursos WHERE activo = 1");
$courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Guardar los registros en el índice de Algolia
$index->saveObjects($courses, ['autoGenerateObjectIDIfNotExist' => true]);

echo 'Cursos indexados en Algolia';
?>
