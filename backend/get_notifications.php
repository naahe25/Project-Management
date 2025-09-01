<?php
include "db.php";
header("Content-Type: application/json");

$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;
if (!$user_id) { http_response_code(400); echo json_encode(['error'=>'user_id required']); exit(); }

$stmt = $conn->prepare("SELECT id, type, payload, is_read, created_at FROM notifications WHERE user_id=? ORDER BY created_at DESC");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$res = $stmt->get_result();
$out = [];
while ($row = $res->fetch_assoc()) $out[] = $row;
echo json_encode($out);
$stmt->close();
?>