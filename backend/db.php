<?php
// backend/db.php
// Database connection (MySQL)
$host = "localhost";
$user = "root";
$pass = ""; // if your MySQL has a password for root, put it here
$dbname = "project_management";

$conn = new mysqli($host, $user, $pass, $dbname);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "DB connection failed: " . $conn->connect_error]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}
?>