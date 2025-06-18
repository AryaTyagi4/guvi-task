<?php
// php/db.php
$mysqli = new mysqli('mysql', 'guviuser', getenv('MYSQL_PASSWORD'), 'guvi');
if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'MySQL connection failed']);
    exit;
}
require __DIR__ . '/../vendor/autoload.php';
$mongoClient = new MongoDB\Client("mongodb://".getenv('MONGO_USER').":".getenv('MONGO_PASS')."@mongo:27017");
$mongoDB = $mongoClient->guvi;
?>