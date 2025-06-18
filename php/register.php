<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$username = trim($data['username'] ?? '');
$passwordRaw = $data['password'] ?? '';

// Backend validation and sanitization
if (!preg_match('/^[a-zA-Z0-9_]{3,}$/', $username)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid username. Use at least 3 letters, numbers, or underscores.']);
    exit;
}
if (strlen($passwordRaw) < 6) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must be at least 6 characters.']);
    exit;
}

// Hash the password
$password = password_hash($passwordRaw, PASSWORD_BCRYPT);

// Check if user exists
$stmt = $mysqli->prepare("SELECT id FROM users WHERE username=?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Username already exists']);
    exit;
}
$stmt->close();

// Insert user
$stmt = $mysqli->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $mysqli->error]);
    exit;
}
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$stmt->close();

// Create empty profile in MongoDB
$mongoDB->profiles->insertOne([
    'username' => $username,
    'age' => '',
    'dob' => '',
    'contact' => ''
]);

echo json_encode(['success' => true]);