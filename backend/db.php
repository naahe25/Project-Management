<?php

session_start();

$DB_HOST = '127.0.0.1';
$DB_NAME = 'project_management';
$DB_USER = 'root';
$DB_PASS = ''; 

$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'DB connection failed: ' . $conn->connect_error]);
    exit();
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit();
?>
