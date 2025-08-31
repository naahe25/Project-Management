<?php
include "db.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
if(!isset($data['id'])) { http_response_code(400); echo json_encode(['error'=>'id required']); exit(); }
$id = (int)$data['id'];
$stmt = $conn->prepare("UPDATE notifications SET is_read=1 WHERE id=?");
$stmt->bind_param("i",$id);
if($stmt->execute()){ echo json_encode(['message'=>'Marked']); } else { http_response_code(500); echo json_encode(['error'=>'Failed']); }
$stmt->close();
?>