<?php
// php/profile.php
header('Content-Type: application/json');
require 'db.php';
require 'redis_session.php';

$headers = getallheaders();
$session = $headers['Authorization'] ?? '';

$username = $redis->get($session);
if (!$username) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid session']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $profile = $mongoDB->profiles->findOne(['username' => $username]);
    // Always return a valid object, even if profile is missing
    if (!$profile) {
        $profile = ['age' => '', 'dob' => '', 'contact' => ''];
    } else {
        if (isset($profile->_id)) unset($profile->_id);
        // Convert BSONDocument to array if needed
        $profile = (array)$profile;
    }
    echo json_encode($profile);
}elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Backend validation
    $age = isset($data['age']) ? intval($data['age']) : null;
    $dob = isset($data['dob']) ? $data['dob'] : '';
    $contact = isset($data['contact']) ? $data['contact'] : '';

    if ($age !== null && ($age < 0 || $age > 120)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid age']);
        exit;
    }
    if ($dob && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $dob)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid date format']);
        exit;
    }
    if ($contact && !preg_match('/^\d{10}$/', $contact)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid contact']);
        exit;
    }

    $mongoDB->profiles->updateOne(
        ['username' => $username],
        ['$set' => [
            'age' => $age,
            'dob' => $dob,
            'contact' => $contact
        ]]
    );
    echo json_encode(['success' => true]);
}
?>