<?php
include "db.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
if(!isset($data['user_id'], $data['type'])) { http_response_code(400); echo json_encode(['error'=>'user_id and type required']); exit(); }
$user_id = (int)$data['user_id'];
$type = $data['type'];
$payload = isset($data['payload']) ? json_encode($data['payload']) : null;

$stmt = $conn->prepare("INSERT INTO notifications (user_id, type, payload) VALUES (?, ?, ?)");
$stmt->bind_param("iss", $user_id, $type, $payload);
if($stmt->execute()){
    echo json_encode(['message'=>'Notification added','id'=>$stmt->insert_id]);
} else {
    http_response_code(500); echo json_encode(['error'=>'Failed']);
}
$stmt->close();
?>