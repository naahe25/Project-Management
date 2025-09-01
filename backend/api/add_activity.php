<?php
include __DIR__ . '/../db.php';
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['user_id'],$data['action'])) { http_response_code(400); echo json_encode(['error'=>'Missing']); exit(); }
$user_id = (int)$data['user_id']; $action = $data['action'];
$stmt = $conn->prepare('INSERT INTO activity_log (user_id,action) VALUES (?,?)');
$stmt->bind_param('is',$user_id,$action);
if ($stmt->execute()) echo json_encode(['message'=>'Logged']); else { http_response_code(500); echo json_encode(['error'=>'Fail']); }
$stmt->close();
?>
