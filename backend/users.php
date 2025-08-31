<?php
include "db.php";
header("Content-Type: application/json");

// GET -> list users
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $res = $conn->query("SELECT id, username, email, created_at FROM users ORDER BY username ASC");
    $out = [];
    while ($row = $res->fetch_assoc()) $out[] = $row;
    echo json_encode($out);
    exit();
}
http_response_code(405);
echo json_encode(['error'=>'Method not allowed']);
?>