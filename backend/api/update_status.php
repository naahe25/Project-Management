<?php
include __DIR__ . '/../db.php';
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['id'],$data['status'])) { http_response_code(400); echo json_encode(['error'=>'Missing']); exit(); }
$id = (int)$data['id']; $status = $data['status'];
$stmt = $conn->prepare('UPDATE tasks SET status=? WHERE id=?');
$stmt->bind_param('si',$status,$id);
if ($stmt->execute()) echo json_encode(['message'=>'Updated']); else { http_response_code(500); echo json_encode(['error'=>'Update failed']); }
$stmt->close();
?>
