<?php
header('Content-Type: application/json');
require 'db.php';
require 'redis_session.php';

$data = json_decode(file_get_contents('php://input'), true);
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

// Backend validation and sanitization
if ($username === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Username and password are required']);
    exit;
}
if (!preg_match('/^[a-zA-Z0-9_]{3,}$/', $username)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid username']);
    exit;
}

// Fetch user
$stmt = $mysqli->prepare("SELECT password FROM users WHERE username=?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->bind_result($hash);
if ($stmt->fetch() && password_verify($password, $hash)) {
    $session = bin2hex(random_bytes(32));
    $redis->set($session, $username, ['ex' => 3600]);
    echo json_encode(['session' => $session]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
}
$stmt->close();
?>